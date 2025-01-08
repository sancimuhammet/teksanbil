import React, { useState } from "react";
import "./Home.css";
const Home = () => {
  const stories = [
    {
      id: 4,
      konu: "Bilim",
      zaman:"9 Ocak 2025",
      title: "Bataklıktaki Çocuk: İnsanlığa Uzanan Keşif",
      image: "/images/Fleming.png",
      description: `Bir zamanlar İskoçya’nın yemyeşil kırsallarında yaşayan bir çiftçi, sıradan bir gününde hiç beklenmedik bir olayla karşılaştı. Çiftlik yakınlarından gelen çığlıklar, onu tarladaki işini bırakıp koşmaya sevk etti. Bataklığın kenarına vardığında, bir çocuğun çaresizce çırpındığını ve yavaş yavaş bataklığa saplandığını gördü.

Tereddüt etmeden bataklığa atıldı, güçlü elleriyle çocuğu kavrayarak güvenli bir yere çekti. Küçük çocuk korkmuş ama sağ salim kurtulmuştu. O sırada olay yerine çocuğun babası yetişti. Soylu görünüşlü bu adam, oğlunun hayatını kurtaran çiftçiye derin bir minnet duydu.

"Bu iyiliğinizin karşılığını nasıl ödeyebilirim?" diye sordu. Çiftçi ise alçakgönüllü bir tavırla, "İnsani bir görevimi yerine getirdim, bir ödül istemem," diyerek teklifi geri çevirdi. Ancak soylu adam bu iyiliğin unutulmasına gönlü razı olmadı. Bir süre düşündü ve gözleri çiftçinin genç oğluna kaydı.

"Eğer ödül istemiyorsanız, bırakın oğlunuzun eğitimiyle ilgileneyim. Onun, hayatta büyük işler başarabilmesi için bir şansım olsun."

Çiftçi bu öneriyi kabul etti. Oğlu, en iyi okullarda eğitim aldı. Yıllar geçti, çiftçinin oğlu tıp bilimine büyük bir tutku geliştirdi ve tıp dünyasına adım attı.

1928 yılına gelindiğinde, bu genç adam, Londra’daki mütevazı laboratuvarında bir deney sırasında sıradışı bir şey fark etti. Küf mantarlarının, bakterilerin çoğalmasını engellediğini gözlemledi. Bu keşif, modern tıbbın en büyük buluşlarından biri olan penisilinin temelini attı.

Penisilin, bakteriyel enfeksiyonlara karşı ilk etkili antibiyotik oldu. Zatürre, sepsis, tifo gibi ölümcül hastalıklar artık tedavi edilebilir hale geldi. II. Dünya Savaşı sırasında yaralı askerlerin hayatta kalmasında hayati bir rol oynadı ve Fleming’e Nobel Ödülü kazandırdı.

Alexander Fleming’in hikayesi, bir çiftçinin fedakarlığıyla başladı ve insanlık tarihini değiştiren bir keşifle son buldu. Bazen küçük bir yardım, dünyanın seyrini değiştirecek kadar büyük bir dönüşüme ilham olabilir.
`,
    },
    {
      id: 1,
      author: "Yazar: Muhammet Şanci",
      zaman:"3 Ocak 2025",
      title: "Hayal Kırıklığının Yankısı",
      konu:"Duygusal Çöküş",
      image: "/hayal.webp",
      description: `Bir zamanlar umutla yeşeren topraklarda,
       her şeyin mümkün olduğu o sınırsız diyarlarda, bir hikaye başlar.
        İnsan, sonsuz ihtimallerin büyüsüne kapılır, hayalleriyle göğe uzanır.
         Ancak zaman, o cömert ellerini birden geri çeker.
          Hayaller, kırılan cam parçaları gibi yere saçılır ve insan,
           kanayan elleriyle onları toplamaya çalışır. Hayal kırıklığı, soğuk bir rüzgâr gibi eser yüreklerde. İlk başta hafif bir serinlik gibi gelir; dayanılır sanırsınız.
            Ama o rüzgâr şiddetlenir, her şeyi savurur. Tüm anlamlar bir anda boşluğa düşer. İnsan, kendi hayalinin enkazında bir yabancıya dönüşür. "Niye?" diye sorarsınız, ama cevap bulamazsınız. Çünkü bazen evren, sessiz kalmayı tercih eder. Kırılan parçalar, yeniden bir
             araya gelmeyecek kadar keskindir. İşte o an anlarsınız: Bu hikaye, baştan sona bir yanılgıymış. Artık umut etmek yorucudur. Beklentiler, zincirlere dönüşmüştür.
            Gözlerinizi kapatır ve teslim olursunuz. Vazgeçmek, bir kabulleniş gibi gelir sonunda. Hayat, cevap vermiyorsa belki de yanlış sorular soruluyordur. Ama işin en acı yanı şudur: Hayal kırıklığı,
             insana her şeyi sorgulatırken geriye tek bir cevap bırakır "hiçbir şey" . Ve bazen bu "hiçlik", her şeyin ötesinde bir rahatlık sunar. Sonunda, o derin sessizlikte,
             insan bir fısıltı gibi mırıldanır: "Belki de en büyük özgürlük,
              artık hiçbir şey beklememektir`,
    },
    {
      id: 2,
      author: "Yazar: Muhammet Şanci",
      title: "Kuantum: Bir Bilgisayar Anatomisi",
      zaman:"3 Ocak 2025",
      konu:"Teknoloji",
      image: "/kuantum bilgisayar.png",
      description: `Hayal edin, aynı anda
       hem kapalı hem de açık olabilen bir kutu. Bu, 
       Schrödinger’in kedisinden esinlenmiş bir gerçeklik; ama bu kez 
       kutunun içinde bir bilgisayar var! Kuantum bilgisayarlar, klasik bilgisayarların asla erişemeyeceği
        bir hızda işlem yapabiliyor. Bunun sırrı, "bit" yerine "kübit" dediğimiz birimleri kullanmalarında gizli.
       Kübitler, aynı anda hem 0 hem de 1 olabiliyor tıpkı bir dalganın hem yukarı hem aşağı hareket etmesi gibi. Bu yetenek, "süperpozisyon" denilen kuantum dünyasının sihrinden geliyor.
        Ancak iş bununla bitmiyor. Kuantum dolanıklık sayesinde, birbirine ışık yılları uzaklıkta iki kübit bile eşzamanlı olarak tepki verebiliyor. Einstein’ın bile "ürkütücü" bulduğu bu fenomen, kuantum bilgisayarları inanılmaz kılıyor. Şimdi bir senaryo düşünelim: Süper karmaşık bir molekülün özelliklerini anlamak istiyorsunuz.
        Klasik bilgisayarların bu hesaplamayı tamamlaması yıllar alabilir. Ama bir kuantum bilgisayar? Birkaç saniyede yapabilir. İşte bu yüzden bilim insanları, kuantum bilgisayarların ilaç geliştirme, 
        yapay zeka ve enerji yönetimi gibi alanlarda devrim yaratacağını düşünüyor. Kuantum bilgisayarları basitçe tarif etmek gerekirse; klasik bilgisayarların son model spor arabası olduğunu düşünün. Kuantum bilgisayar ise ışık hızında hareket eden bir uzay gemisi! 
        Peki ya bu uzay gemisi tamamen işlevsel hale geldiğinde?
         Belki de bir gün, evrenin sırlarını çözmek için onu kullanacağız.`,
    },
    {
      id: 3,
      author: "Yazar: Muhammet Şanci",
      title: "Rodin ve Düşünen Adam: Taşın İçindeki İnsan",
      image: "adam.png",
      konu:"Sanat",
      zaman:"3 Ocak 2025",
      description: `Paris’te bir parkın ortasında, başını ellerine dayamış, derin düşüncelere dalmış bir figür: "Düşünen Adam." Dünyaca ünlü bu heykel, Auguste Rodin’in dehasının ve sanatın derin etkisinin bir simgesidir. Ancak "Düşünen Adam" sadece bir heykel değil; insan zihninin ve varoluşun karmaşıklığını anlatan bir öyküdür.

Rodin, "Düşünen Adam"ı 1880'lerde, büyük bir projenin parçası olarak tasarladı: "Cehennem Kapıları." Bu proje, Dante’nin İlahi Komedya’sından ilham alıyordu. Heykel, aslında Dante’nin bir yansıması olarak yaratılmıştı; cehennem kapısının tepesinde oturup, insanlığın acılarını ve ahlaki ikilemlerini düşünen bir figür.

Ancak zamanla, "Düşünen Adam" bu bağlamdan koptu ve kendi başına bir anlam kazandı. İnsanlar bu figürü, kendi varoluş mücadeleleriyle ilişkilendirdi. Felsefeciler, bilim insanları ve sıradan insanlar, onun duruşunda, evrensel bir düşünme ve sorgulama halini buldu. Rodin, bu heykeli yaratırken, taşı sadece şekillendirmemiş; ona ruh üflemişti.

Peki, taş bir heykel nasıl olur da bu kadar güçlü bir etki yaratabilir? Cevap basit: Rodin, taşın içinde zaten var olan insanı bulmuştu. Kendisi şöyle derdi:
"Ben taşları yontmuyorum. Onların içindeki figürü özgür bırakıyorum."

"Düşünen Adam," taşın içinden özgür bırakılmış bir ruhun simgesidir. O, bize düşünmenin, sorgulamanın ve insan olmanın ne anlama geldiğini hatırlatır. Bu heykel, zamanın ve mekanın ötesine geçen bir çağrı yapar: "Kim olduğunuzu ve neden burada olduğunuzu düşünün.`,
    }, 
  ];

  const [readMore, setReadMore] = useState(null);

  const handleReadMore = (id) => {
    setReadMore(readMore === id ? null : id);
  };

  return (
    <div className="home">
      {stories.map((story) => (
        <div key={story.id} className="story">
          <h2 className="story-title">{story.title}</h2>
          <p className="author">{story.author}</p>
          <p className="story-konu">{story.konu}</p>
          <p className="story-zaman">
            📅{story.zaman}
          </p>
          <img src={story.image} alt={story.title} className="story-image" />
          <p className="story-description">
            
            {readMore === story.id
              ? story.description
              : `${story.description.substring(0, 150)}...`}
          </p>
          <button
            className="read-more-btn"
            onClick={() => handleReadMore(story.id)}
          >
            {readMore === story.id ? "Kapat" : "Devamını Oku"}
          </button>
          <hr className="divider" />
        </div>
      ))}
    </div>
  );
};


export default Home;
