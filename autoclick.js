const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

(async () => {
    console.log("===================================================");
    console.log("       Evrensel Otomatik Tıklama Robotu");
    console.log("===================================================\n");
    console.log("(Varsayılan değerleri kullanmak için doğrudan Enter'a basabilirsiniz)\n");

    const defaultUrl = 'https://egitim.uzmanisegitim.com/UserLoginPage.aspx';
    let url = await askQuestion(`1. Gidilecek web sitesinin linki nedir?\n[Varsayılan: ${defaultUrl}]: `);
    if (!url.trim()) url = defaultUrl;

    const defaultSelector = '#btnNext';
    let selector = await askQuestion(`\n2. Tıklanacak butonun HTML Seçicisi (ID'si veya Class'ı) nedir?\n[Varsayılan: ${defaultSelector}]: `);
    if (!selector.trim()) selector = defaultSelector;

    const defaultText = 'İleri';
    let buttonText = await askQuestion(`\n3. Butonun üzerinde hangi yazı/kelime olunca tıklansın?\n(Sürekli tıklamasını istiyorsanız bir kez Boşluk tuşuna basıp Enterlayın)\n[Varsayılan: ${defaultText}]: `);
    if (!buttonText.trim() && buttonText !== ' ') buttonText = defaultText;

    console.log(`\n4. Çalışma Modunu Seçin:`);
    console.log(`[1] Zamanlı Kontrol (Her X saniyede bir kontrol edip tıklar)`);
    console.log(`[2] Akıllı Tetikleme (Butonun sayacını izler, aktif olduğu salise anında tıklar)`);
    let modeStr = await askQuestion(`Seçiminiz (1 veya 2) [Varsayılan: 2]: `);
    const mode = modeStr.trim() === '1' ? 1 : 2;

    let intervalMs = 200; // Akıllı tetikleme (saniyede 5 kez çok hızlı kontrol)
    
    if (mode === 1) {
        let intervalStr = await askQuestion(`\nSaniyede bir kaç kez kontrol edilsin?\n[Varsayılan: 5 saniye]: `);
        intervalMs = parseInt(intervalStr) * 1000 || 5000;
    }

    rl.close();

    console.log("\n=== Robot Ayarlandı, Tarayıcı Başlatılıyor ===");
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized', '--ignore-certificate-errors']
    });

    const page = (await browser.pages())[0];
    
    if (mode === 1) {
        console.log(`\nLütfen giriş yapın. Robot her ${intervalMs/1000} saniyede bir butonu arayacaktır...`);
    } else {
        console.log(`\nLütfen giriş yapın. Robot "Akıllı Tetikleme" modunda devrede! Butonun geri sayımı (5,4,3..) bittiği salise anında tıklayacaktır...`);
    }
    
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
    } catch (e) {}

    setInterval(async () => {
        try {
            const frames = page.frames();

            for (let frame of frames) {
                const button = await frame.$(selector);
                if (button) {
                    const btnData = await frame.evaluate(el => {
                        return {
                            disabled: el.disabled || el.hasAttribute('disabled'),
                            text: el.innerText || el.textContent
                        };
                    }, button);
                    
                    const textMatches = buttonText === ' ' ? true : (btnData.text && btnData.text.includes(buttonText));

                    // Eğer buton kilitliyse (disable) hiçbir şey yapmaz, döngü bekler.
                    // Kilit kalktığı (enable) an if içine girer ve tıklar.
                    if (!btnData.disabled && textMatches) {
                        console.log(`[${new Date().toLocaleTimeString()}] Butonun kilidi açıldı, anında tıklandı!`);
                        await button.click();
                        break; 
                    }
                }
            }
        } catch (error) {}
    }, intervalMs); // Mode 2 ise 200 milisaniyede bir (saniyenin 5'te biri) kontrol eder.
})();
