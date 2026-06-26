const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, 'config.json');
const logPath = path.join(__dirname, 'socios_robotu.log');

// Yardımcı bekleme fonksiyonu
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Tarih formatlama yardımcısı
function formatDateTime(date) {
    return date.toLocaleString('tr-TR', { hour12: false });
}

// Log yazma yardımcıları
function writeLog(message) {
    const timeStr = formatDateTime(new Date());
    const logLine = `[${timeStr}] ${message}\n`;
    fs.appendFileSync(logPath, logLine, 'utf8');
    console.log(message);
}

function writeError(message, err = '') {
    const timeStr = formatDateTime(new Date());
    const logLine = `[${timeStr}] HATA: ${message} ${err ? (err.stack || err) : ''}\n`;
    fs.appendFileSync(logPath, logLine, 'utf8');
    console.error(message, err);
}

// config.json dosyasını yükler veya yoksa varsayılan değerlerle oluşturur
function loadConfig() {
    if (fs.existsSync(configPath)) {
        try {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (e) {
            writeError("config.json okunurken hata oluştu, sıfırlanıyor.", e);
        }
    }
    const defaultConfig = {
        lastRunTime: null,
        nextScheduledTime: null
    };
    saveConfig(defaultConfig);
    return defaultConfig;
}

// config.json dosyasına yazar
function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
}

// Bir sonraki çalışma vaktini belirleme algoritması
function calculateNextScheduledTime(baseDate) {
    const nextTime = new Date(baseDate.getTime() + (24 * 60 + 5) * 60 * 1000);
    const hour = nextTime.getHours();

    // 17:00 - 23:59 aralığında olmasını sağla
    if (hour < 17) {
        nextTime.setHours(17, 0, 0, 0);
        writeLog("[Zamanlayıcı] Hesaplanan yeni zaman 23:59'u aştığı için ertesi gün 17:00'ye ayarlandı.");
    }

    return nextTime;
}

// Avlanma (Sandık Açma) Otomasyonu Ana Fonksiyonu
async function runHuntAutomation() {
    writeLog("Av Otomasyonu Başlatıldı.");

    const userDataDir = path.join(__dirname, 'user_data');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: userDataDir,
        protocolTimeout: 180000, // 3 dakika - ağır sayfalar için yeterli süre
        args: ['--start-maximized', '--ignore-certificate-errors']
    });

    const page = (await browser.pages())[0];
    let firstChestOpenedAt = null;

    try {
        writeLog("Ana görev sayfasına gidiliyor...");
        await page.goto('https://app.socios.com/hunt', { waitUntil: 'networkidle2', timeout: 60000 });
        await delay(5000); // Socios SPA'nın tam render olması için ek süre

        // Aktif av görev butonlarını bul
        const huntButtonSelector = 'button[data-testid^="tokenHuntLobby-huntButton-v2-"][data-testid$="-action-button"]';
        let huntButtons = await page.$$(huntButtonSelector);

        if (huntButtons.length === 0) {
            writeLog("Sayfada aktif av görevi bulunamadı. Lütfen giriş yapıldığından emin olun.");
            await browser.close();
            return null;
        }

        const huntButtonIds = [];
        for (let btn of huntButtons) {
            try {
                const testId = await page.evaluate(el => el.getAttribute('data-testid'), btn);
                if (testId) huntButtonIds.push(testId);
            } catch (evalErr) {
                writeError("Buton data-testid okunamadı, atlanıyor.", evalErr);
            }
        }

        writeLog(`${huntButtonIds.length} adet aktif av görevi sırayla taranacak.`);

        for (let i = 0; i < huntButtonIds.length; i++) {
            const currentButtonId = huntButtonIds[i];
            writeLog(`Görev ${i + 1}/${huntButtonIds.length} yapılıyor (${currentButtonId})...`);

            if (page.url() !== 'https://app.socios.com/hunt') {
                await page.goto('https://app.socios.com/hunt', { waitUntil: 'networkidle2', timeout: 60000 });
                await delay(3000);
            }

            const targetButton = await page.$(`button[data-testid="${currentButtonId}"]`);
            if (targetButton) {
                await targetButton.click();
                await delay(5000);
            } else {
                continue;
            }

            let continueChests = true;
            let openedInThisMap = 0;

            while (continueChests) {
                const poiButtons = await page.$$('button[data-testid^="tokenHunt-map-poi-"]');
                let targetChest = null;

                for (let btn of poiButtons) {
                    try {
                        const isClosed = await page.evaluate(el => {
                            const svg = el.querySelector('svg');
                            return svg && svg.getAttribute('aria-label') === 'Closed Chest';
                        }, btn);

                        if (isClosed) {
                            targetChest = btn;
                            break;
                        }
                    } catch (evalErr) {
                        writeError("Sandık durumu okunamadı, bir sonraki deneniyor.", evalErr);
                    }
                }

                if (targetChest) {
                    try {
                        const chestId = await page.evaluate(el => el.getAttribute('data-testid'), targetChest);
                        writeLog(`Kapalı sandık açılıyor: ${chestId}`);

                        if (!firstChestOpenedAt) {
                            firstChestOpenedAt = new Date();
                            writeLog(`Günün ilk sandık açılış saati kaydedildi: ${formatDateTime(firstChestOpenedAt)}`);
                        }

                        await targetChest.click();
                        await delay(1500);

                        let openChestClicked = false;
                        const buttons = await page.$$('button');
                        for (let btn of buttons) {
                            try {
                                const text = await page.evaluate(el => el.innerText || el.textContent, btn);
                                if (text && (text.includes('Open Chest') || text.includes('Open') || text.includes('Aç'))) {
                                    await btn.click();
                                    openChestClicked = true;
                                    break;
                                }
                            } catch (evalErr) {
                                // Buton artık DOM'da olmayabilir, devam et
                            }
                        }

                        await delay(2000);

                        const keepHuntingSelector = 'button[data-testid="tokenHunt-grabbedToken-keepHunting"]';
                        const keepHuntingBtn = await page.$(keepHuntingSelector);

                        if (keepHuntingBtn) {
                            await keepHuntingBtn.click();
                            await delay(2000);
                            openedInThisMap++;
                        } else {
                            await page.keyboard.press('Escape');
                            await delay(1500);
                        }
                    } catch (err) {
                        writeError("Sandık açılırken hata oluştu.", err);
                        await page.keyboard.press('Escape');
                        await delay(1500);
                    }
                } else {
                    writeLog(`Bu haritada başka kapalı sandık kalmadı. (Açılan: ${openedInThisMap})`);
                    continueChests = false;
                }
            }
        }

        writeLog("Tüm görevler başarıyla tamamlandı!");
        await browser.close();
        return firstChestOpenedAt;

    } catch (err) {
        writeError("Kritik otomasyon hatası oluştu.", err);
        try { await browser.close(); } catch (e) { }
        return null;
    }
}

// Ana çalışma döngüsü ve zamanlayıcı
(async () => {
    writeLog("Socios Otomatik Zamanlayıcı Robotu Arka Planda Başlatıldı.");

    let lastLogHour = -1; // Dosyaya periyodik bekleme durumunu yazmak için

    while (true) {
        const config = loadConfig();
        const now = new Date();

        if (!config.nextScheduledTime) {
            const currentHour = now.getHours();
            if (currentHour >= 17 && currentHour <= 23) {
                writeLog("Saat aralığı uygun (17:00 - 23:59). Otomasyon doğrudan başlatılıyor...");
                config.nextScheduledTime = now.toISOString();
                saveConfig(config);
            } else {
                const target = new Date();
                target.setHours(17, 0, 0, 0);
                if (now.getHours() >= 17) {
                    target.setDate(target.getDate() + 1);
                }
                config.nextScheduledTime = target.toISOString();
                saveConfig(config);
                writeLog(`Çalışma aralığı dışındayız. İlk çalışma planlandı: ${formatDateTime(target)}`);
            }
        }

        const scheduledDate = new Date(config.nextScheduledTime);
        const msRemaining = scheduledDate.getTime() - now.getTime();

        if (msRemaining > 0) {
            const hours = Math.floor(msRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((msRemaining % (1000 * 60)) / 1000);

            // Konsola anlık yaz (dosyayı şişirmemek için)
            process.stdout.write(`\r[Beklemede] Sonraki çalışma: ${formatDateTime(scheduledDate)} | Kalan Süre: ${hours} sa ${minutes} dk ${seconds} sn   `);

            // Log dosyasına her saat başı durum özeti yaz
            if (now.getHours() !== lastLogHour) {
                fs.appendFileSync(logPath, `[${formatDateTime(now)}] Bekleme modu aktif. Planlanan Zaman: ${formatDateTime(scheduledDate)} (Kalan: ${hours} saat ${minutes} dakika)\n`, 'utf8');
                lastLogHour = now.getHours();
            }

            await delay(1000);
        } else {
            writeLog("Çalışma zamanı geldi! Tarayıcı başlatılıyor...");
            const runStartTime = await runHuntAutomation();

            const configUpdate = loadConfig();
            configUpdate.lastRunTime = new Date().toISOString();

            if (runStartTime) {
                const nextDate = calculateNextScheduledTime(runStartTime);
                configUpdate.nextScheduledTime = nextDate.toISOString();
                writeLog(`Sonraki çalışma planlandı: ${formatDateTime(nextDate)}`);
            } else {
                const retryDate = new Date(Date.now() + 60 * 60 * 1000);
                if (retryDate.getHours() < 17) {
                    retryDate.setHours(17, 0, 0, 0);
                }
                configUpdate.nextScheduledTime = retryDate.toISOString();
                writeLog(`Sandık açılamadı. 1 saat sonra tekrar denenecek: ${formatDateTime(retryDate)}`);
            }

            saveConfig(configUpdate);
            writeLog("Bekleme moduna geri dönülüyor...");
            console.log("\n---------------------------------------------------");
            await delay(5000);
        }
    }
})();
