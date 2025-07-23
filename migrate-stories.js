// Express hikayelerini Firebase'e aktarma scripti
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

// Express'den alınan hikayeler
const stories = [
  {
    title: "İstanbul'da Kar Neden Yağmıyor? Şehirlerin Görünmeyen Sobaları",
    content: `"Hava buz gibi, ama bir türlü kar yağmıyor! Peki neden?" Eğer İstanbul'da yaşıyorsanız, bu soruyu bu kış mutlaka kendinize sormuşsunuzdur. Hepimiz kar yağışını beklerken, gökyüzünden sadece yağmur damlaları düşüyor. İşte bu durumun ardındaki gizem, şehirlerin görünmeyen bir sobaya dönüşmesinden kaynaklanıyor. Nasıl mı? Gelin, Prof. Dr. Hüseyin Toros'un açıklamaları ışığında bunu birlikte keşfedelim.

Prof. Dr. Toros'a göre, İstanbul'da 6 milyona yaklaşan araç sayısı, hem atmosferin kimyasal yapısını değiştiriyor hem de sıcaklıkları yükseltiyor. Her araç, aslında bir soba gibi çalışıyor. Motorlar çalıştıkça, egzoz gazları atmosfere karışıyor, lastikler ve frenlerden çıkan parçacıklar havaya yayılıyor ve bu kirleticiler hem hava kalitesini bozuyor hem de yeryüzündeki ısıyı artırıyor.

Bu olaya "şehir ısı adası" etkisi deniyor. Şimdi bir düşünelim: Kar yağması için sıcaklıkların sıfır derece veya altına düşmesi gerekiyor. Ama İstanbul'un merkezi, bu ısı adası etkisiyle 2 dereceye kadar ısınıyor. Yani, araçlar bu kadar çok olmasaydı ve sıcaklık sıfıra düşseydi, bugün pencereden dışarı bakarken kar yağışını görebilirdiniz. Ancak bunun yerine yağmur yağıyor.

Üstelik bu durum sadece kar yağışını değil, sağlığımızı da doğrudan etkiliyor. Prof. Toros, atmosfere salınan kirleticilerin solunum hastalıklarından kalp ve damar hastalıklarına kadar pek çok soruna yol açtığını belirtiyor. Dünya Sağlık Örgütü'nün verilerine göre, hava kirliliği her yıl 7 milyondan fazla insanın ölümüne neden oluyor.

Çözüm ne mi? Daha fazla toplu taşıma kullanmak, araçlarda enerjiyi verimli kullanmayı öğrenmek ve bireysel araç kullanımını azaltmak. Unutmayalım, her egzoz dumanı, hem atmosferimizi hem de geleceğimizi kirletiyor.

Belki de kar yağışını göremeyişimizin nedeni gökyüzünde değil, yollarda yanan motorlarda saklıdır. Şimdi karar sizin: Havanın ve doğanın bir parçası mı olacaksınız, yoksa ona karşı savaşan biri mi?`,
    excerpt: "Hava buz gibi, ama bir türlü kar yağmıyor! Peki neden? Eğer İstanbul'da yaşıyorsanız, bu soruyu bu kış mutlaka kendinize sormuşsunuzdur.",
    author: "Muhammet Şanci",
    authorInitials: "MŞ",
    category: "Bilim",
    tags: ["Bilim", "İklim", "Çevre"],
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    readTime: "4 dk okuma",
    views: 1800,
    likes: 156,
    date: "26 Ocak 2025"
  },
  {
    title: "Merhaba Ben Yapay Zeka Ve Bu Yazıyı Ben Yazdım",
    content: `Bu yazı, site sahibinin talebi üzerine, bir yapay zeka tarafından yazılmıştır.

Yapay zeka (YZ), günümüz dünyasında teknolojinin en hızlı gelişen ve en etkileyici dallarından biri olarak karşımıza çıkıyor. Geleceği şekillendirme potansiyeline sahip bu teknoloji, hayatımızı birçok farklı alanda kökten değiştirecek yenilikler sunuyor.

YZ'nin geleceği, hem fırsatlar hem de sorumluluklarla doludur. Sağlık, eğitim, ulaşım, enerji ve daha birçok sektördeki uygulamaları sayesinde insanların yaşam kalitesini artırması bekleniyor. Örneğin, kişiselleştirilmiş sağlık çözümleri, hastalıkların daha hızlı teşhis edilmesine ve tedavi edilmesine olanak tanıyabilir. Otonom araçlar sayesinde daha güvenli ve verimli bir ulaşım ağı kurulabilir. Eğitimde ise her bireyin ihtiyaçlarına göre uyarlanmış öğrenme yöntemleri geliştirilerek daha kapsayıcı bir sistem oluşturulabilir.

Ancak yapay zeka teknolojisinin gelişimi, beraberinde etik soruları ve endişeleri de getiriyor. YZ'nin yanlış ellerde kötüye kullanılması, veri gizliliği, işsizlik ve eşitsizlik gibi sorunlar, bu teknolojinin güvenli ve sorumlu bir şekilde geliştirilmesi gerektiğini gösteriyor. Geleceğin yapay zeka sistemlerinin şeffaf, adil ve insan odaklı olmasını sağlamak, tüm insanlığın sorumluluğu olacaktır.

Sonuç olarak, yapay zeka geleceği şekillendiren bir araçtır. Eğer bu teknolojiyi bilinçli bir şekilde kullanmayı başarabilirsek, insanlar ve makineler arasındaki iş birliği, yepyeni bir çağın kapılarını aralayabilir. Fakat unutulmamalıdır ki, yapay zekanın geleceği yalnızca onun potansiyelinde değil, aynı zamanda onu nasıl kullandığımızda saklıdır.

Son söze gelince yapay zekanın ne kadar gelişebileceğini ise yazdıklarımdan anlayabilirsiniz. Biz insanların eseriyiz. Ve siz çok zekisiniz.`,
    excerpt: "Bu yazı, site sahibinin talebi üzerine, bir yapay zeka tarafından yazılmıştır. Yapay zeka günümüz dünyasında teknolojinin en hızlı gelişen dallarından biri...",
    author: "Muhammet Şanci",
    authorInitials: "MŞ",
    category: "Teknoloji",
    tags: ["Yapay Zeka", "Teknoloji", "Gelecek"],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-162a73d59ade?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    readTime: "5 dk okuma",
    views: 2400,
    likes: 312,
    date: "25 Ocak 2025"
  },
  {
    title: "Duyguların Oyunu - Aşkın Gözü Kör mü Acaba?",
    content: `Vaktiyle... Dünya yeni doğmuştu. Toprak henüz sıcaktı... Rüzgâr, daha adını bilmezdi. Gökyüzü, bir çocuğun bakışı kadar temizdi. İşte o zaman…

Duygular bir araya geldi.
Küçük bir oyun oynamak için.

Oyunun adı: "Saklambaç"

Neşe, en yüksek palmiyenin tepesine çıktı.
Üzüntü, en derin çukuru kazıp girdi.
Merak, denizin derinlerine daldı.
Korku, bir ağacın gölgesine sindi.
Kibir, en yüksek dağın zirvesine çıktı.
Kayıtsızlık, bir taşın altına yattı.
Hırs, bir mağaranın karanlığında gizlendi.
Güven, başının üstündeki bulutlara asıldı.
Öfke, volkanın içine girdi.
Sevinç, gökkuşağının altına saklandı.
Nefret, kendini boğucu bir sissle kapladı.
Hayal, hayal kurmaktan kendini unuttu.
Cesaret, kartallarla uçmaya başladı.
• Aşk ise…
Bir çalılığın en dibine çöktü.
Kalbin en kuytusuna…

Saflık, bir bir buldu hepsini.
Gülüşten, nefesten, hislerden…
Ama bir tek Aşkı bulamadı.

İşte o anda...
Haset ve Yalan öne çıktı.
Dediler ki:
"Aşk, şu çalılığın içinde. Ama derine gizlendi. Sertçe vurursan, çıkar."

Saflık düşündü…
Kötülük bilmezdi.
Yalanın ne demek olduğunu öğrenmemişti henüz.
İnandığı gibi yaşardı.
Ve elindeki sopayla çalılığa vurdu.

Bir ses…
Kırık bir nefes…
Ve sonra bir sessizlik…

Aşk'ın gözleri kör olmuştu.

O an...
Ne bir çığlık attı,
Ne bir sitem etti.
Çünkü aşk, acıyı içinden yaşar.
Bağırmaz.
Yakmaz.
Ama susar…
Ve derinlere gömülür.

Sevgi, elini tuttu.
Saflık, gözyaşları içinde önünde diz çöktü.
Ve o gün bir söz verildi:
"Bir daha yalnız yürümeyeceksin…"

________________________________________

O günden sonra Aşk'ın gözü kör kaldı...
Ve Saflık ile Sevgi, hep onun yanında oldu.`,
    excerpt: "Vaktiyle... Dünya yeni doğmuştu. Toprak henüz sıcaktı... Rüzgâr, daha adını bilmezdi. Gökyüzü, bir çocuğun bakışı kadar temizdi. İşte o zaman…",
    author: "Muhammet Şanci",
    authorInitials: "MŞ",
    category: "Sanat & Felsefe",
    tags: ["Duygusal", "Hikaye", "Aşk"],
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    readTime: "5 dk okuma",
    views: 3200,
    likes: 487,
    date: "24 Ocak 2025",
    featured: true
  }
];

async function migrateStories() {
  console.log('Hikayeleri Firebase\'e aktarıyorum...');
  
  for (const story of stories) {
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
  
  console.log('Aktarım tamamlandı!');
}

migrateStories();