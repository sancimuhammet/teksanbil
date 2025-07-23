// Tüm Express hikayelerini Firebase'e aktarma scripti
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Tüm Express hikayelerini aktarıyorum
const allStories = [
  {
    title: "Bir Anda Gelen Mutsuzluk: Görünmeyen Bir Misafir",
    content: `Bazen hiçbir sebep yokmuş gibi hissedersiniz. Her şey yolunda giderken, içinize bir ağırlık çöker. Sanki bir misafir, kapınızı çalmadan içeri girmiştir. Adını koyamazsınız ama oradadır. Neden böyle hissettiğinizi anlamaya çalışırsınız. Belki bir ses, bir koku ya da uzak bir hatıra... Ama nedenini bulamazsınız.

Bu ani mutsuzluk hissi, aslında zihnimizin ve bedenimizin derinliklerinde işleyen bir mekanizmanın sonucudur. Beynimizdeki serotonin ya da dopamin seviyelerinde yaşanan küçük bir dalgalanma bile ruh halimizi değiştirebilir. Belki geçmişte yaşadığınız bir olay bilinçaltınızdan yükselmiş, sizi fark etmeden etkisi altına almıştır.

Bazen de bu duygunun kaynağı dışarıdan gelir. Gözle göremediğimiz ışık eksikliği, uzun süreli yorgunluk ya da bedenimizin ihtiyaç duyduğu bir vitaminden mahrum kalması, o "ağır misafirin" sebebi olabilir. Hormonlarımız, kan şekerimiz, hatta sadece birkaç saatlik uykusuzluk bile bu duygu dalgasını tetikleyebilir.

Ama işin güzel yanı şu: Bu hisler geçicidir. Tıpkı kapınızı çalan bir misafir gibi, geldiği gibi gitmeyi bilir. Yapmamız gereken tek şey, bu duyguyu bir düşman gibi görmeden, onun bir mesaj taşıdığını anlamaktır. Belki bir mola, belki bir nefes, belki de derinlerde bastırdığınız bir düşünce...

Her mutsuzluk bir soru işaretidir. Onu görmezden gelmek yerine, anlamaya çalışmak belki de o anı daha kolay atlatmamızı sağlar. Misafir gidince geriye sakinlik kalır. Ve hayat, kaldığı yerden devam eder.`,
    excerpt: "Bazen hiçbir sebep yokmuş gibi hissedersiniz. Her şey yolunda giderken, içinize bir ağırlık çöker. Sanki bir misafir, kapınızı çalmadan içeri girmiştir.",
    author: "Muhammet Şanci",
    authorInitials: "MŞ",
    category: "Psikoloji",
    tags: ["Psikoloji", "Duygu", "İnsan"],
    imageUrl: "https://images.unsplash.com/photo-1494253109108-2e30c049369b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    readTime: "3 dk okuma",
    views: 956,
    likes: 127,
    date: "24 Ocak 2025"
  },
  {
    title: "Kelebek Etkisi: Küçük Bir Kararın Sonsuz Yankısı",
    content: `Bir kelebeğin kanat çırpışı… Sadece bir an, sadece küçük bir hareket. Ama bu hareket, okyanusların ötesinde bir fırtınaya dönüşebilir. İşte hayat da tam olarak böyle bir şeydir: Küçük seçimlerin, büyük sonuçlar doğurduğu bir kaos dansı. 

2004 yapımı Kelebek Etkisi filmindeki Evan Treborn'un hikayesini hatırlayın. Evan, geçmişteki hatalarını düzeltmek için zamanda geri gidiyor, ama her müdahalesi, geleceği daha da karmaşık hale getiriyor. Bir karar, bir kişiyle yollarını sonsuza dek ayırmasına neden oluyor. Bir başka karar, sevdiği insanların hayatını kurtarırken kendi mutluluğunu feda etmesini gerektiriyor.

Evan'ın yaptığı her seçim, bir domino taşı gibi diğerlerini de deviriyor. Hayatı yeniden yazmaya çalışırken, aslında sadece kaosu büyütüyor.

Bu, sadece bir film mi? Yoksa hepimizin hayatında var olan bir gerçeklik mi?

Şimdi düşün: Geçmişte verdiğin bir kararı değiştirsen, şu an nerede olurdun? Belki bir otobüsü kaçırdığın gün aslında hayatını değiştiren biriyle tanışacaktın. Belki de hiç tahmin etmediğin bir kararın, bir başkasının hayatında zincirleme bir değişime yol açtı.

Kelebek etkisi, bizi şunu düşünmeye davet eder: Hayatta attığımız her adımın bir yankısı vardır. Küçük bir iyilik, hiç tanımadığın birinin hayatını kurtarabilir. Ya da basit bir karar, bambaşka bir hayatın kapılarını açabilir.

Hayatın karmaşıklığını kabul etmek cesaret ister. Ama unutma, bu karmaşanın içinde gücün var: Kanat çırpmak.

Peki, o kanatları çırptığında neye dönüşeceksin?`,
    excerpt: "Bir kelebeğin kanat çırpışı… Sadece bir an, sadece küçük bir hareket. Ama bu hareket, okyanusların ötesinde bir fırtınaya dönüşebilir.",
    author: "Muhammet Şanci",
    authorInitials: "MŞ",
    category: "Sanat & Felsefe",
    tags: ["Felsefe", "Kaos Teorisi", "Film"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    readTime: "4 dk okuma",
    views: 1300,
    likes: 201,
    date: "23 Ocak 2025"
  },
  {
    title: "Kuantum: Bir Bilgisayar Anatomisi",
    content: `Hayal edin, aynı anda hem kapalı hem de açık olabilen bir kutu. Bu, Schrödinger'in kedisinden esinlenmiş bir gerçeklik; ama bu kez kutunun içinde bir bilgisayar var! Kuantum bilgisayarlar, klasik bilgisayarların asla erişemeyeceği bir hızda işlem yapabiliyor. 

Bunun sırrı, "bit" yerine "kübit" dediğimiz birimleri kullanmalarında gizli. Kübitler, aynı anda hem 0 hem de 1 olabiliyor tıpkı bir dalganın hem yukarı hem aşağı hareket etmesi gibi. Bu yetenek, "süperpozisyon" denilen kuantum dünyasının sihrinden geliyor.

Ancak iş bununla bitmiyor. Kuantum dolanıklık sayesinde, birbirine ışık yılları uzaklıkta iki kübit bile eşzamanlı olarak tepki verebiliyor. Einstein'ın bile "ürkütücü" bulduğu bu fenomen, kuantum bilgisayarları inanılmaz kılıyor.

Şimdi bir senaryo düşünelim: Süper karmaşık bir molekülün özelliklerini anlamak istiyorsunuz. Klasik bilgisayarların bu hesaplamayı tamamlaması yıllar alabilir. Ama bir kuantum bilgisayar? Birkaç saniyede yapabilir.

İşte bu yüzden bilim insanları, kuantum bilgisayarların ilaç geliştirme, yapay zeka ve enerji yönetimi gibi alanlarda devrim yaratacağını düşünüyor.

Kuantum bilgisayarları basitçe tarif etmek gerekirse; klasik bilgisayarların son model spor arabası olduğunu düşünün. Kuantum bilgisayar ise ışık hızında hareket eden bir uzay gemisi!

Peki ya bu uzay gemisi tamamen işlevsel hale geldiğinde? Belki de bir gün, evrenin sırlarını çözmek için onu kullanacağız.`,
    excerpt: "Hayal edin, aynı anda hem kapalı hem de açık olabilen bir kutu. Bu, Schrödinger'in kedisinden esinlenmiş bir gerçeklik; ama bu kez kutunun içinde bir bilgisayar var!",
    author: "Muhammet Şanci",
    authorInitials: "MŞ",
    category: "Teknoloji",
    tags: ["Kuantum", "Bilgisayar", "Teknoloji"],
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    readTime: "5 dk okuma",
    views: 2700,
    likes: 312,
    date: "23 Ocak 2025"
  },
  {
    title: "Zaman Makinesi: Hayalden Gerçeğe",
    content: `Zaman yolculuğu, insanlığın en büyük hayallerinden biridir. Einstein'ın genel görelilik teorisi, zamanın esnek bir kavram olduğunu ve hızla değişebileceğini gösterdi. Peki, zaman makinesi gerçekten mümkün mü?

Fizikçiler, zaman yolculuğunun teorik olarak mümkün olduğunu düşünüyor. Işık hızına yakın hızlarda seyahat etmek, kütleli cisimlerin çevresinde dolaşmak ya da solucan delikleri kullanmak gibi yöntemler önerilmiştir.

Ancak pratik zorluklar vardır. Işık hızına ulaşmak için sonsuz enerji gerekir. Solucan delikleri ise henüz keşfedilmemiştir ve kararlı olup olmadıkları bilinmiyor.

Belki de gelecekte, şu anda hayal bile edemediğimiz teknolojilerle zaman yolculuğu mümkün olacak. Ta ki o güne kadar, zaman makinemiz hayal gücümüzde kalmaya devam edecek.`,
    excerpt: "Zaman yolculuğu, insanlığın en büyük hayallerinden biridir. Einstein'ın teorileri ışığında zaman makinesinin mümkün olup olmadığını keşfedin...",
    author: "Dr. Elif Kara",
    authorInitials: "EK",
    category: "Bilim",
    tags: ["Fizik", "Zaman", "Einstein"],
    imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    readTime: "3 dk okuma",
    views: 890,
    likes: 76,
    date: "24 Ocak 2025"
  },
  {
    title: "Akıllı Şehirler: Geleceğin Kentleri",
    content: `Akıllı şehirler, teknoloji ile kentsel hayatı birleştiren devrimci bir konsept. IoT sensörleri, yapay zeka ve büyük veri analizi sayesinde şehirler daha verimli, sürdürülebilir ve yaşanabilir hale geliyor.

Singapur, Barcelona ve Amsterdam gibi şehirler bu alanda öncülük ediyor. Akıllı trafik sistemleri, enerji yönetimi, atık kontrolü ve çevre izleme gibi uygulamalarla yaşam kalitesi artırılıyor.

Türkiye'de de İstanbul ve Ankara gibi büyük şehirler akıllı şehir projelerini hayata geçirmeye başladı. Gelecekte tüm şehirlerin birer "akıllı organizma" haline gelmesi bekleniyor.

Bu dönüşüm sadece teknolojik değil, aynı zamanda sosyal bir değişimi de beraberinde getiriyor. Vatandaşların kent yönetimine katılımı artıyor ve şehirler daha demokratik hale geliyor.`,
    excerpt: "Akıllı şehirler teknoloji ile kentsel hayatı birleştiren devrimci bir konsept. Geleceğin şehirlerinin nasıl şekillendiğini keşfedin...",
    author: "Prof. Dr. Mehmet Öz",
    authorInitials: "MÖ",
    category: "Teknoloji",
    tags: ["Akıllı Şehir", "IoT", "Teknoloji"],
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    readTime: "4 dk okuma",
    views: 1560,
    likes: 203,
    date: "23 Ocak 2025"
  },
  {
    title: "İnsan Psikolojisinin Derinlikleri",
    content: `İnsan psikolojisi, en karmaşık ve fascinant alanlardan biridir. Bilinçaltı, davranış kalıpları ve duygusal zeka gibi konular, insanı anlamak için temel taşlardır.

Freud'un psikanaliz teorisi, Jung'un kolektif bilinçdışı kavramı ve modern bilişsel psikoloji yaklaşımları, insan zihninin farklı boyutlarını açıklamaya çalışır.

Günümüzde nörobilim ve psikoloji birleşerek, beynin nasıl çalıştığını daha iyi anlamamızı sağlıyor. Bu gelişmeler, mental sağlık tedavilerinde de devrim yaratıyor.

İnsan davranışlarını etkileyen faktörleri anlayarak, hem bireysel hem de toplumsal düzeyde daha sağlıklı ilişkiler kurabilir ve daha mutlu bir yaşam sürebiliriz.`,
    excerpt: "İnsan psikolojisinin karmaşık dünyasına bir yolculuk. Bilinçaltından modern nörobilime, zihnin sırlarını keşfedin...",
    author: "Dr. Ayşe Demir",
    authorInitials: "AD",
    category: "Psikoloji",
    tags: ["Psikoloji", "Bilinçaltı", "Davranış"],
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    readTime: "6 dk okuma",
    views: 2100,
    likes: 189,
    date: "22 Ocak 2025"
  }
];

async function migrateAllStories() {
  console.log('Kalan tüm hikayeleri Firebase\'e aktarıyorum...');
  
  for (const story of allStories) {
    try {
      const docRef = await addDoc(collection(db, 'stories'), {
        ...story,
        createdAt: new Date(),
        published: true
      });
      console.log(`✅ "${story.title}" aktarıldı - ID: ${docRef.id}`);
    } catch (error) {
      console.error(`❌ "${story.title}" aktarılamadı:`, error);
    }
  }
  
  console.log('Tüm hikayeler aktarıldı!');
}

migrateAllStories();