# Evrensel Eğitim Robotu (Otomatik İleri Tıklayıcı)

Bu proje, sayfalarda belirli bir süre beklemeyi zorunlu kılan online eğitim sistemlerinde, anketlerde veya slayt geçişlerinde sizin yerinize periyodik olarak belirlediğiniz bir butona tıklayan akıllı bir otomasyon robotudur. 

Tarayıcıyı arka planda fiziksel bir insanmış gibi kontrol ettiği için sayfa yenilenmeleri, gizli çerçeveler (iframe) ve güvenlik engellerine takılmaz.

## 📦 Kurulum (İlk Kullanım Öncesi)

Bu robotun çalışabilmesi için bilgisayarınızda **Node.js** yüklü olmalıdır. 

### Windows Kurulumu

1. Eğer yüklü değilse, [Node.js resmi sitesine](https://nodejs.org/) giderek programı indirip Next (İleri) diyerek kurun.
2. Bu proje klasörünü bilgisayarınıza indirin/kopyalayın.
3. Klasörün içinde bir kez terminal (veya komut istemi) açıp şu komutu çalıştırın:
   ```bash
   npm install
   ```
   *(Bu komut, robotun tarayıcıyı kontrol edebilmesi için gerekli olan Puppeteer kütüphanesini indirecektir. Sadece ilk seferde bir kere yapmanız yeterlidir.)*

### 🐧 Linux Kurulumu (Ubuntu, Pardus, Linux Mint)

Linux'ta kurulumu kolaylaştıran bir kurulum scripti hazırladık. Bu script:
- Node.js'in yüklü olup olmadığını kontrol eder
- Puppeteer'ın çalışması için gereken sistem kütüphanelerini yükler
- `npm install` komutunu çalıştırır
- Tüm `.sh` scriptlerine çalıştırma izni verir

**Kurulum adımları:**

1. Bu proje klasörünü bilgisayarınıza indirin/kopyalayın.
2. Terminal açın ve proje klasörünün içindeki `socios-robotu` dizinine gidin:
   ```bash
   cd /proje/yolu/socios-robotu
   ```
3. Kurulum scriptine çalıştırma izni verin ve çalıştırın:
   ```bash
   chmod +x kurulum.sh
   ./kurulum.sh
   ```

> **Not (Pardus Kullanıcıları):** Pardus'un bazı sürümlerinde Node.js varsayılan olarak yüklü gelmez. Kurulum scripti size gereken komutları gösterecektir. Alternatif olarak:
> ```bash
> sudo apt update && sudo apt install -y nodejs npm
> ```

> **Not (Ubuntu / Linux Mint Kullanıcıları):** Ubuntu 22.04+ ve Linux Mint 21+ sürümlerinde Node.js genellikle depoda mevcuttur. Güncel LTS sürümü için [NodeSource](https://github.com/nodesource/distributions) kullanabilirsiniz.

## 🚀 Nasıl Kullanılır?

Kurulumu yaptıktan sonra uygulamayı çalıştırmak çok basittir. İşletim sisteminize göre aşağıdaki kısayolları kullanabilirsiniz:

### Windows Kullanıcıları İçin
Klasörün içinde bulunan **`Robotu-Baslat.bat`** dosyasına çift tıklamanız yeterlidir.
*(Dilerseniz bu dosyaya sağ tıklayıp "Gönder -> Masaüstüne Kısayol Oluştur" diyerek masaüstünden de başlatabilirsiniz.)*

### 🐧 Linux (Ubuntu, Pardus, Linux Mint) Kullanıcıları İçin

#### Eğitim Robotu (Otomatik İleri Tıklayıcı)
Klasörün kökündeki **`Robotu-Baslat.sh`** dosyasını kullanmalısınız.
İlk çalıştırmadan önce terminalden bu dosyaya çalışma izni verin:
```bash
chmod +x Robotu-Baslat.sh
```
Ardından dosyaya çift tıklayarak veya terminalden `./Robotu-Baslat.sh` komutuyla robotu başlatabilirsiniz.

#### 🏹 Socios Robotu (Sandık Açma Otomasyonu)

Socios robotu için `socios-robotu` klasörünün içinde **4 farklı başlatma scripti** mevcuttur:

| Script | Açıklama | Komut |
|--------|----------|-------|
| **`otomatik_baslat.sh`** | Zamanlayıcı ile çalışır, config.json'daki zamana göre otomatik başlar | `./otomatik_baslat.sh` |
| **`manuel_baslat.sh`** | Robotu hemen şimdi başlatır (zamanlayıcıyı sıfırlar) | `./manuel_baslat.sh` |
| **`socios_arkaplan.sh`** | Terminali kapatsan da arka planda çalışmaya devam eder | `./socios_arkaplan.sh` |
| **`robotu_durdur.sh`** | Çalışan robotu durdurur | `./robotu_durdur.sh` |

**Kullanım örneği:**
```bash
cd socios-robotu

# Terminalde açık başlatmak için:
./otomatik_baslat.sh

# Veya arka planda (terminali kapatabilirsiniz):
./socios_arkaplan.sh

# Durdurmak için:
./robotu_durdur.sh

# Logları takip etmek için:
tail -f socios_robotu.log
```

> **💡 İpucu:** `socios_arkaplan.sh` ile arka planda başlattığınızda terminali kapatabilirsiniz. Robot çalışmaya devam eder. Logları `tail -f socios_robotu.log` ile canlı takip edebilirsiniz.

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

## 📁 Proje Yapısı

```
📂 proje-koku/
├── 📄 Robotu-Baslat.bat        # Windows - Eğitim robotu başlatıcı
├── 📄 Robotu-Baslat.sh          # Linux   - Eğitim robotu başlatıcı
├── 📄 autoclick.js              # Eğitim robotu ana scripti
├── 📄 package.json              # Node.js bağımlılıkları
│
└── 📂 socios-robotu/
    ├── 📄 socios.js             # Socios ana otomasyon scripti
    ├── 📄 config.json           # Zamanlayıcı ayarları
    │
    ├── 📄 otomatik_baslat.bat   # Windows - Otomatik mod
    ├── 📄 otomatik_baslat.sh    # Linux   - Otomatik mod
    ├── 📄 manuel_baslat.bat     # Windows - Manuel mod
    ├── 📄 manuel_baslat.sh      # Linux   - Manuel mod
    ├── 📄 Robotu-Durdur.bat     # Windows - Robotu durdur
    ├── 📄 robotu_durdur.sh      # Linux   - Robotu durdur
    ├── 📄 Socios-Arkaplan.vbs   # Windows - Arka plan çalıştırıcı
    ├── 📄 socios_arkaplan.sh    # Linux   - Arka plan çalıştırıcı
    ├── 📄 kurulum.sh            # Linux   - Otomatik kurulum scripti
    └── 📄 socios_robotu.log     # Robot log dosyası
```
