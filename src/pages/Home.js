import React, { useState } from 'react'; // useState'i burada import ediyoruz
import './Home.css';

const Home = () => {
  const stories = [
{
      id: 1,
      author:"Muhammet Şanci",
      title: "Hayal Kırıklığının Yankısı ",
      image: "/hayal.webp" ,
      description: `Bir zamanlar umutla yeşeren topraklarda, her şeyin mümkün olduğu o sınırsız diyarlarda, bir hikaye başlar. İnsan, sonsuz ihtimallerin büyüsüne kapılır, hayalleriyle göğe uzanır. Ancak zaman, o cömert ellerini birden geri çeker. Hayaller, kırılan cam parçaları gibi yere saçılır ve insan, kanayan elleriyle onları toplamaya çalışır.

Hayal kırıklığı, soğuk bir rüzgâr gibi eser yüreklerde. İlk başta hafif bir serinlik gibi gelir; dayanılır sanırsınız. Ama o rüzgâr şiddetlenir, her şeyi savurur. Tüm anlamlar bir anda boşluğa düşer. İnsan, kendi hayalinin enkazında bir yabancıya dönüşür.

"Niye?" diye sorarsınız, ama cevap bulamazsınız. Çünkü bazen evren, sessiz kalmayı tercih eder. Kırılan parçalar, yeniden bir araya gelmeyecek kadar keskindir. İşte o an anlarsınız: Bu hikaye, baştan sona bir yanılgıymış.

Artık umut etmek yorucudur. Beklentiler, zincirlere dönüşmüştür. Gözlerinizi kapatır ve teslim olursunuz. Vazgeçmek, bir kabulleniş gibi gelir sonunda. Hayat, cevap vermiyorsa belki de yanlış sorular soruluyordur.

Ama işin en acı yanı şudur: Hayal kırıklığı, insana her şeyi sorgulatırken geriye tek bir cevap bırakır — hiçbir şey. Ve bazen bu "hiçlik", her şeyin ötesinde bir rahatlık sunar.

Sonunda, o derin sessizlikte, insan bir fısıltı gibi mırıldanır:
"Belki de en büyük özgürlük, artık hiçbir şey beklememektir`,
    },
    {
        id: 2,
        image:"/kuantum bilgisayar.png",
        author:"Muhammet Şanci",
        title: "Kuantum: Bir Bilgisayar Anatomisi",
        description: `Hayal edin, aynı anda hem kapalı hem de açık olabilen bir kutu. Bu, Schrödinger’in kedisinden esinlenmiş bir gerçeklik; ama bu kez kutunun içinde bir bilgisayar var!

Kuantum bilgisayarlar, klasik bilgisayarların asla erişemeyeceği bir hızda işlem yapabiliyor. Bunun sırrı, "bit" yerine "kübit" dediğimiz birimleri kullanmalarında gizli. Kübitler, aynı anda hem 0 hem de 1 olabiliyor—tıpkı bir dalganın hem yukarı hem aşağı hareket etmesi gibi. Bu yetenek, "süperpozisyon" denilen kuantum dünyasının sihrinden geliyor.

Ancak iş bununla bitmiyor. Kuantum dolanıklık sayesinde, birbirine ışık yılları uzaklıkta iki kübit bile eşzamanlı olarak tepki verebiliyor. Einstein’ın bile "ürkütücü" bulduğu bu fenomen, kuantum bilgisayarları inanılmaz kılıyor.

Şimdi bir senaryo düşünelim: Süper karmaşık bir molekülün özelliklerini anlamak istiyorsunuz. Klasik bilgisayarların bu hesaplamayı tamamlaması yıllar alabilir. Ama bir kuantum bilgisayar? Birkaç saniyede yapabilir. İşte bu yüzden bilim insanları, kuantum bilgisayarların ilaç geliştirme, yapay zeka ve enerji yönetimi gibi alanlarda devrim yaratacağını düşünüyor.

Kuantum bilgisayarları basitçe tarif etmek gerekirse; klasik bilgisayarların son model spor arabası olduğunu düşünün. Kuantum bilgisayar ise ışık hızında hareket eden bir uzay gemisi!

Peki ya bu uzay gemisi tamamen işlevsel hale geldiğinde? Belki de bir gün, evrenin sırlarını çözmek için onu kullanacağız.` // kısa versiyon
        
      },
      // Diğer hikayeler
    ];
  
    const [readMore, setReadMore] = useState(null); // useState kullanarak başlangıç durumunu null olarak ayarlıyoruz
  
    const handleReadMore = (id) => {
      setReadMore(id);  // Butona tıklanınca ilgili hikayenin tamamını göster
    };
  
    return (
<div className="home">
  <h1>Öne Çıkanlar</h1>
  {stories.map((story) => (
    <div key={story.id} className="story">
      <p className="author">
        Yazar: {story.author} <span className="icon">✍️</span>
      </p>
      <img
        src={story.image}
        alt={story.title}
        className="story-image"
        style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
      />
      <h2 className="story-title">{story.title}</h2>
      <p className="story-description">
        {readMore === story.id
          ? story.description
          : `${story.description.substring(0, 150)}...`}
      </p>
      {readMore !== story.id && (
        <button
          onClick={() => handleReadMore(story.id)}
          className="read-more-btn"
        >
          Devamını Oku
        </button>
      )}
    </div>
  ))}
</div>


    );
  };
  
  export default Home;