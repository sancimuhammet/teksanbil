# Elektrik Atölyesi

MSANC Studio için çevrimdışı çalışan Android eğitim uygulaması. Sürüm 0.2: dokunarak kablo bağlanan iki animasyonlu atölye, 15 konuluk öğrenme haritası, altı rotada 24 kısa görev ve altı mühendislik ön hesap aracı. İlerleme yalnızca cihazda tutulur. Uygulamada hesap, reklam veya internet izni yoktur.

## Kapsam

- Ampul atölyesi: pil, anahtar ve ampul uçlarını sürükleyerek bağla; anahtara dokununca kapalı devrede ampul ve akım animasyonu çalışır. Ampulü atlayan doğrudan kısa bağlantı algılanır.
- Kumanda panosu atölyesi: STOP, START, KM1 bobin ve yardımcı kontaktan kilitlemeli kumanda devresi kur; motor dönüş animasyonu ve STOP ile bırakma. Kavramsal 24 V simülasyonudur.
- 15 konu: devre temelleri, AC, üç faz, kablo, kompanzasyon, motor kumandası, trafo, koruma, güç elektroniği, analog ve dijital elektronik, PLC, ölçüm, yenilenebilir enerji, şebeke/proje.
- Temel elektrik; AC ve üç faz; kablolar ve koruma; kompanzasyon; makineler; güç sistemleri için 24 kısa görev.
- Yük akımı (1/3 faz), kompanzasyon kvar, kablo akım taşıma, gerilim düşümü, adyabatik kısa devre kesiti, trafo nominal akımı ve yaklaşık trafo uçları kısa devre akımı.
- Yanlış yanıtta tekrar deneme, doğru yanıtta 10 XP ve yerel ilerleme kaydı.
- Android 15 ve eski sürümlerde sistem çubuklarının iç boşluğu uygulanır; uygulama alt gezinmesi telefon tuşlarının üzerinde kalır.

## Hesap varsayımları

| Araç | Yöntem | Sınır |
| --- | --- | --- |
| Yük akımı | I=P/(U cosφ) veya P/(√3 U cosφ) | Dengeli, sinüzoidal, güç girişi elektriksel aktif güçtür. Motor verimi dahil değildir. |
| Kompanzasyon | Qc=P(tanφ1−tanφ2) | Endüktif başlangıç, hedef cosφ daha yüksek; harmonik ve kademe seçimi ayrıca yapılır. |
| Kablo kapasitesi | Iz'=Iz kT kG | Yalnız Cu/PVC, 70°C, üç yüklü damar, havada yöntem C, tabloda bulunan sıcaklıklar ve duvar/kapalı tavada tek katman temas eden 1–9 devre. 30°C baz. Toprak, XLPE, farklı damar, harmonikler ve diğer dizilimler kapsam dışı. |
| Gerilim düşümü | Tek faz: 2I(Rcosφ+Xsinφ)L, üç faz: √3I(Rcosφ+Xsinφ)L | R=23,7/S Ω/km Cu, X=0,08 Ω/km yaklaşımı. L tek yön km; dengeli yük. Sınır, tesisat kullanımına göre değerlendirilir. |
| Kısa devre kesiti | S≥I√t/k | Cu/PVC 115, Cu/XLPE 143, Al/PVC 76, Al/XLPE 94. Kısa süreli adyabatik termik denetim; standart kesit yukarı yuvarlanmalı. |
| Trafo | In=S/(√3U), Ik≈In·100/uk% | Yalnız trafo empedansı, sekonder uçlarında yaklaşık simetrik değer; üst şebeke/kablo/arızanın DC bileşeni hariç. |

Gerçek tesisat tasarımı için bu tekil sonuçlar yeterli değildir: koruma koordinasyonu, kısa devre kesme kapasitesi, ortam ve güzergâh, topraklama, nötr harmonikleri, motor kalkışı ve üretici verileri ayrıca kontrol edilmelidir.

## Teknik kaynaklar

- [IEC 60364-5-52:2009+AMD1:2024](https://webstore.iec.ch/en/publication/103734), kablo döşeme ve seçimi; tam standart metni depoda yer almaz.
- [Schneider Electric Electrical Installation Guide: kablo seçimi](https://www.electrical-installation.org/enwiki/General_method_for_cable_sizing), G12, G16 ve G20 (IEC B.52.4 özet tablosu).
- [Güç katsayısı düzeltme ilkesi](https://www.electrical-installation.org/enwiki/Theoretical_principles_to_improve_power_factor).
- [Gerilim düşümü](https://www.electrical-installation.org/enwiki/Calculation_of_voltage_drop_in_steady_load_conditions) ve [kısa devre termik dayanım](https://www.electrical-installation.org/enwiki/Verification_of_the_withstand_capabilities_of_cables_under_short-circuit_conditions).
- [Kompanzasyon ve harmonik rezonans](https://www.electrical-installation.org/enwiki/Risk_of_resonance_due_to_power-system_harmonics).

## APK

GitHub → **Actions** → **Android APK** → son başarılı çalıştırma → **Elektrik-Atolyesi-debug-apk** artifact dosyasını indir. İçindeki `app-debug.apk` test için kurulabilir. `main` dalına gönderilen her değişiklik bu akışı çalıştırır. Bu debug APK'sı Play Store yayını için imzalı AAB değildir.

Yerel derleme: JDK 17 ve Android SDK ile Gradle 8.9 üzerinde `gradle :app:assembleDebug`. Formül testleri: `javac -d out app/src/main/java/com/msanc/elektrikatolyesi/Engineering.java tests/EngineeringTest.java && java -cp out EngineeringTest`.

Bu atölyeler belirli görevlerin bağlantı mantığını simüle eder; genel amaçlı SPICE devre çözücüsü değildir. Sonraki hedefler: serbest devre kurma, değişken direnç/ölçü aleti, kompanzasyon kademe simülasyonu, kablo döşeme yöntemlerinin genişletilmesi, koruma eğrileri, ölçüm senaryoları ve mühendis incelemesi. Genişletilmeden önce kaynak ve örnek çözüm kontrolü gereklidir.
