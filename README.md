# Evrensel Eğitim Robotu (Otomatik İleri Tıklayıcı)

Bu proje, sayfalarda belirli bir süre beklemeyi zorunlu kılan online eğitim sistemlerinde, anketlerde veya slayt geçişlerinde sizin yerinize periyodik olarak belirlediğiniz bir butona tıklayan akıllı bir otomasyon robotudur. 

Tarayıcıyı arka planda fiziksel bir insanmış gibi kontrol ettiği için sayfa yenilenmeleri, gizli çerçeveler (iframe) ve güvenlik engellerine takılmaz.

## 📦 Kurulum (İlk Kullanım Öncesi)

Bu robotun çalışabilmesi için bilgisayarınızda **Node.js** yüklü olmalıdır. 

1. Eğer yüklü değilse, [Node.js resmi sitesine](https://nodejs.org/) giderek programı indirip Next (İleri) diyerek kurun.
2. Bu proje klasörünü bilgisayarınıza indirin/kopyalayın.
3. Klasörün içinde bir kez terminal (veya komut istemi) açıp şu komutu çalıştırın:
   ```bash
   npm install
   ```
   *(Bu komut, robotun tarayıcıyı kontrol edebilmesi için gerekli olan Puppeteer kütüphanesini indirecektir. Sadece ilk seferde bir kere yapmanız yeterlidir.)*

## 🚀 Nasıl Kullanılır?

Kurulumu yaptıktan sonra uygulamayı çalıştırmak çok basittir. İşletim sisteminize göre aşağıdaki kısayolları kullanabilirsiniz:

### Windows Kullanıcıları İçin
Klasörün içinde bulunan **`Robotu-Baslat.bat`** dosyasına çift tıklamanız yeterlidir.
*(Dilerseniz bu dosyaya sağ tıklayıp "Gönder -> Masaüstüne Kısayol Oluştur" diyerek masaüstünden de başlatabilirsiniz.)*

### Linux (Ubuntu, Pardus vb.) veya macOS Kullanıcıları İçin
Klasörün içinde bulunan **`Robotu-Baslat.sh`** dosyasını kullanmalısınız. 
İlk çalıştırmadan önce terminalden bu dosyaya çalışma izni verin:
```bash
chmod +x Robotu-Baslat.sh
```
Ardından dosyaya çift tıklayarak veya terminalden `./Robotu-Baslat.sh` komutuyla robotu başlatabilirsiniz.

## ⚙️ Ayarlar ve Kullanım

Kısayola tıkladığınızda karşınıza siyah bir komut ekranı (terminal) çıkacak ve size **4 basit soru** soracaktır. Hiçbir ayarla uğraşmak istemiyorsanız **sadece Enter tuşuna basarak** varsayılan ayarlarla (Uzmaniş Eğitim Sistemi, Akıllı Tetikleme modu) devam edebilirsiniz.

Farklı bir siteye uyarlamak isterseniz sorulara şu şekilde cevap verin:

1. **Gidilecek web sitesinin linki:** Robotun açmasını istediğiniz tam URL'yi yapıştırın.
2. **HTML Seçicisi (ID veya Class):** Tıklanacak butonun kod dünyasındaki adı. Öğrenmek için sayfadaki butona sağ tıklayıp *İncele* deyin. (Örneğin ID'si btnNext ise `#btnNext` yazın).
3. **Butonun üzerindeki yazı:** Hedef butonun içinde hangi yazı çıktığında tıklanması gerektiğini belirtin. (Örn: `İleri` veya `Sonraki`). *Eğer yazıyı önemsemeden her türlü tıklamasını istiyorsanız bir kez Boşluk tuşuna basıp Enter'layın.*
4. **Çalışma Modunu Seçin:** İki farklı mod mevcuttur:

   | Mod | Açıklama | Ne zaman kullanılır? |
   |-----|----------|----------------------|
   | **[1] Zamanlı Kontrol** | Her X saniyede bir butonu kontrol eder ve bulursa tıklar. Kontrol aralığını siz belirlersiniz. | Sabit süreli bekleme gerektiren basit sayfalar |
   | **[2] Akıllı Tetikleme** ⭐ | Butonu sürekli (saniyenin 5'te biri hızında) izler. Geri sayaç (5-4-3-2-1) biter bitmez, butonun kilidi açıldığı **milisaniye** içinde anında tıklar. | Geri sayımlı sistemler için **önerilen** |

   > **Öneri:** Çoğu online eğitim sistemi geri sayım içerdiğinden **Mod 2 (Akıllı Tetikleme)** seçmeniz tavsiye edilir. Varsayılan değer olarak zaten Mod 2 aktiftir, direkt Enter'a basmanız yeterlidir.

Soruları cevapladıktan sonra otomatik olarak yeni bir Google Chrome / Chromium penceresi açılacaktır.
Açılan pencerede **sisteme kendi bilgilerinizle giriş yapıp eğitimi başlatın.**
Sonrasında arkanıza yaslanın; robotunuz arka planda sessizce bekleyip, zamanı geldiğinde sizin yerinize anında tıklamaya devam edecektir!
