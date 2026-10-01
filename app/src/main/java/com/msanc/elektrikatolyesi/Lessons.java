package com.msanc.elektrikatolyesi;

public final class Lessons {
    private Lessons() {}
    public static final String[] TRACKS = {"Temel elektrik", "AC ve üç faz", "Kablolar ve koruma", "Kompanzasyon", "Makineler", "Güç sistemleri"};
    public static final String[] ICONS = {"⚡", "∿", "▰", "◉", "⚙", "⌁"};
    public static final String[] DESCRIPTIONS = {
        "Gerilimden güce, devreyi okumaya başla", "Fazörler, güç üçgeni ve dengeli sistemler",
        "Kesit, gerilim düşümü ve kısa devre", "cosφ, kondansatör ve harmonikler",
        "Trafo ve motorların çalışma mantığı", "Şebeke, arıza ve seçicilik"
    };
    public static final class Lesson {
        public final int track;
        public final String title, body, formula, question, a, b, c, explanation;
        public final int correct;
        Lesson(int track,String title,String body,String formula,String question,String a,String b,String c,int correct,String explanation) {
            this.track=track;this.title=title;this.body=body;this.formula=formula;this.question=question;
            this.a=a;this.b=b;this.c=c;this.correct=correct;this.explanation=explanation;
        }
        public String option(int n) { return n==0?a:n==1?b:c; }
    }
    public static final Lesson[] ALL = {
        new Lesson(0,"Gerilim ve akım","Gerilim yükleri hareket ettiren potansiyel farktır. Akım, bir kesitten birim zamanda geçen yüktür.","I = Q / t","1 coulomb yük 1 saniyede geçerse akım?","1 A","1 V","1 Ω",0,"Amper, coulomb/saniye olarak tanımlanır."),
        new Lesson(0,"Ohm kanunu","Doğrusal dirençli elemanda akım gerilimle artar, dirençle azalır.","I = U / R","12 V ve 6 Ω için akım?","0,5 A","2 A","72 A",1,"12 / 6 = 2 A."),
        new Lesson(0,"Seri ve paralel","Seride akım aynıdır, dirençler toplanır. Paralelde gerilim aynıdır.","Rseri = R1 + R2","İki 10 Ω direnç seride kaç Ω?","5","10","20",2,"Seride 10 + 10 = 20 Ω."),
        new Lesson(0,"Güç ve enerji","Güç enerjinin aktarım hızıdır. Enerji güç ile zamanın çarpımıdır.","P = U × I ; E = P × t","1 kW yük 3 saat çalışırsa?","3 kWh","3 kW","0,33 kWh",0,"Enerji = 1 kW × 3 h = 3 kWh."),

        new Lesson(1,"AC dalga ve frekans","Sinüzoidal akımın RMS değeri aynı ısıl etkiyi oluşturan DC değeridir. Periyot frekansın tersidir.","T = 1 / f","50 Hz dalganın periyodu?","50 s","20 ms","2 ms",1,"1/50 s = 0,02 s."),
        new Lesson(1,"Fazör ve empedans","AC devrede direnç ve reaktans vektörel olarak birleşir; endüktif yükte akım geride kalır.","|Z| = √(R² + X²)","R=3 Ω, X=4 Ω için |Z|?","1 Ω","7 Ω","5 Ω",2,"3-4-5 üçgeni."),
        new Lesson(1,"Üç fazlı güç","Dengeli üç faz için hat gerilimi ve hat akımıyla aktif güç bulunur.","P = √3 × U × I × cosφ","400 V, 10 A, cosφ≈1 için güç?","6,93 kW","4 kW","12 kW",0,"√3 × 400 × 10 ≈ 6.928 W."),
        new Lesson(1,"Güç üçgeni","Aktif P iş yapar, reaktif Q alanlar arasında salınır, görünür güç S bileşkedir.","S² = P² + Q²","P=3 kW ve Q=4 kvar ise S?","7 kVA","5 kVA","1 kVA",1,"√(9+16)=5 kVA."),

        new Lesson(2,"Akım taşıma","Kablo akımı yalnızca kesitten okunmaz; döşeme, yalıtım, sıcaklık ve gruplanma çarpanları gerekir.","Iz' = Iz × kT × kG","41 A taban değer, kT=0,87 ve kG=0,85 ise?","41 A","47,1 A","30,3 A",2,"41 × 0,87 × 0,85 ≈ 30,3 A."),
        new Lesson(2,"Gerilim düşümü","Hat uzunluğu ve akım arttığında düşüm artar. Üç fazda hatlar arası düşüm için √3 katsayısı kullanılır.","ΔU3φ = √3 I (R cosφ + X sinφ) L","Uzunluk iki katına çıkarsa diğerleri sabitken düşüm?","İki katına çıkar","Değişmez","Yarıya iner",0,"Formül uzunluk ile doğrusaldır."),
        new Lesson(2,"Aşırı akım koruması","Tasarım akımı, koruma ayarı ve kablo kapasitesi birlikte seçilir. Açma karakteristiği ve kısa devre kapasitesi ayrıca doğrulanır.","IB ≤ In ≤ Iz","Iz=30 A iken 40 A koruma?","Her zaman uygun","Bu koşulu sağlamaz","Kesite bağlı değil",1,"40 A > 30 A; temel koordinasyon koşulu bozulur."),
        new Lesson(2,"Kısa devrede ısınma","Kısa süreli adyabatik yaklaşım ile iletken kesiti arıza akımı ve açma süresine göre sınanır.","S ≥ I√t / k","Açma süresi artarsa gerekli kesit?","Azalır","Değişmez","Artar",2,"√t ile büyür; diğer koruma kontrolleri de gerekir."),

        new Lesson(3,"Güç katsayısı","cosφ, temel bileşenin aktif gücünün görünür güce oranıdır. Harmonikli sistemde toplam güç faktörü ayrıca değerlendirilir.","cosφ = P / S","P=80 kW, S=100 kVA için cosφ?","0,8","1,25","0,2",0,"80/100 = 0,8."),
        new Lesson(3,"Gerekli kvar","Başlangıç ve hedef açıların tanjantları arasındaki fark, aktif güçle çarpılır.","Qc = P(tanφ1 − tanφ2)","Hedef cosφ yükseldiğinde ideal Qc?","Negatif olur","Pozitif gereksinim doğar","Daima sıfırdır",1,"Endüktif yük için pozitif kapasitif reaktif güç gerekir."),
        new Lesson(3,"Kademeli kompanzasyon","Değişken yükte küçük kademeler hassas ayar sağlar. Birden fazla kademe röleyle devreye alınabilir.","Qtoplam = Σ Qkademe","5+10+20 kvar kademelerinin toplamı?","20 kvar","30 kvar","35 kvar",2,"Kademelerin toplamı 35 kvar."),
        new Lesson(3,"Harmonik ve rezonans","Kondansatör bankları harmoniklerle rezonansa girebilir; reaktör ve analiz gereksinimi ölçümle belirlenir.","frez ≠ yük harmonikleri","Harmonikli sahada yalnız kvar hesabı yeterli mi?","Hayır, harmonikler incelenir","Evet, her zaman","Gerilim önemsiz",0,"Rezonans ve aşırı yük riski vardır."),

        new Lesson(4,"Transformatör oranı","İdeal trafoda sarım oranı gerilim oranına eşittir; gerçek cihazda kayıplar ve regülasyon vardır.","U1/U2 ≈ N1/N2","Sarım oranı 10:1 ise ideal gerilim oranı?","1:10","10:1","1:1",1,"İdeal oranlar eşittir."),
        new Lesson(4,"Trafo nominal akımı","Üç fazlı transformatörün hat akımı görünür güç ve hat geriliminden hesaplanır.","In = S / (√3 U)","400 V tarafında 400 kVA için yaklaşık akım?","400 A","173 A","577 A",2,"400.000/(√3×400) ≈ 577 A."),
        new Lesson(4,"Asenkron motor","Senkron hız kutup sayısı ve frekansa bağlıdır. Asenkron motorda rotor hızının farkına kayma denir.","ns = 120 f / p","50 Hz, 4 kutupta senkron hız?","1500 dev/dk","3000 dev/dk","750 dev/dk",0,"120×50/4 = 1500 dev/dk."),
        new Lesson(4,"Motor yol verme","Kalkış akımı, gerilim düşümü ve mekanik tork birlikte ele alınmalıdır.","Pmek = T × ω","Yumuşak yol verici neden kullanılır?","Frekans yükseltmek için","Kalkış etkisini sınırlamak için","cosφ'yi daima 1 yapmak için",1,"Gerilim kontrollü kalkış etkileri azaltılabilir."),

        new Lesson(5,"Kısa devre akımı","Trafo uk% ile yapılan hesap yalnız trafo uçlarındaki yaklaşık başlangıç değeridir; şebeke ve kablo empedansları sonucu değiştirir.","Ik ≈ In × 100 / uk%","uk% büyürse yaklaşık Ik?","Artar","Aynı kalır","Azalır",2,"Empedans yüzdesi arttıkça akım düşer."),
        new Lesson(5,"Seçicilik","Arızaya en yakın korumanın açması için zaman-akım eğrileri ve cihaz üreticisinin tabloları karşılaştırılır.","Alt koruma → üst koruma","Hedeflenen ilk açma noktası?","Arızaya en yakın cihaz","En üst şalter","Tüm şalterler",0,"Seçicilik, sağlam bölümlerin enerjide kalmasını amaçlar."),
        new Lesson(5,"Topraklama düzeni","TT, TN ve IT düzenlerinde arıza yolu ve koruma koşulları farklıdır. Tek bir direnç sayısı tüm tesisatı doğrulamaz.","Koruma = düzen + cihaz + ölçüm","Topraklama tasarımında hangisi gerekir?","Sadece renk seçimi","Sistem tipi ve açma koşulları","Yalnız kablo boyu",1,"Koruma düzeni ve ölçümler birlikte doğrulanır."),
        new Lesson(5,"Harmonikler ve nötr","Üçün katı harmonikler dengeli üç fazda nötrde toplanabilir; nötr ve kablo hesabına etki eder.","I3 nötrde toplanabilir","Yüksek 3. harmonik nötr akımı için?","Daima sıfırdır","Fazların aynısı olamaz","Ayrıca değerlendirilir",2,"Nötr akımı faz akımını aşabilir.")
    };
}
