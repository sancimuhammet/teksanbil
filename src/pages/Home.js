import React, { useState } from 'react'; // useState'i burada import ediyoruz
import './Home.css';
const Home = () => {
  const stories = [
{
      id: 1,
      title: "Anka Kuşu: Yeniden Doğmak ",
      
      description: `Bir kuş düşünün... Hayır, daha çok bir fikir aslında. Anka kuşu dediğimiz şey, sadece mitolojik bir varlık değil; insanoğlunun kendini anlamaya çalıştığı en eski simgelerden biri. Yeniden doğuşu, değişimi ve devam etmeyi anlatır. Ama bu fikir, sadece bir masal mı? Yoksa bizim hayatımızdaki bir gerçeğin metaforu mu?

Anka kuşunun hikayesini bir kenara bırakalım ve kendimize dönelim. Hepimizin hayatında “yıkıldığımız” anlar vardır, değil mi? İşte tam da o anlarda Anka kuşunun efsanesi bize bir şey fısıldar: “Yıkım, bir son değildir; yeni bir başlangıçtır.”

Bilim de bunu söylüyor. Bir düşünün, yıldızlar nasıl oluşur? Evrende, devasa bir yıldız patlar, bir süpernova olur ve bu patlamadan kalan parçalar, yeni yıldızların ve gezegenlerin yapı taşlarını oluşturur. Evrendeki bu büyük döngü, Anka kuşunun hikayesini bilimsel bir gerçeklik gibi gözler önüne serer.

Peki ya insana bakalım. Beynimiz, büyük bir travma sonrası bile kendini yeniden yapılandırabilir. Buna nöroplastisite diyoruz. Eski bağlantılar kopar, ama bu kopuştan sonra yeni yollar ortaya çıkar. İnsan, kelimenin tam anlamıyla, küllerinden doğabilir.

Anka kuşunun sırrı burada gizli. Bu hikaye, sadece bir efsane değil; bizim dünyamızda da yankı bulan bir gerçek. Yeniden başlamayı, değişimi ve vazgeçmemeyi hatırlatır. Ve aslında bize şunu söyler: "Bir şeyin sonu, başka bir şeyin başlangıcıdır."

Belki de Anka kuşu, dışarıda değil, hepimizin içinde. Her düştüğümüzde, her kaybettiğimizde ve her yeniden başladığımızda... İçimizdeki o ateşin küllerinden yeni bir umut filizlenir. Bu yüzden Anka kuşu, aslında bizim hikayemizdir.`,
      Image: "/public/images/langirt.png"
    },
    {
        id: 2,
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
        <h1>Hikayeler</h1>
        {stories.map(story => (
          <div key={story.id} className="story">
            <h2 className="story-title">{story.title}</h2>
            <p className="story-description">
              {readMore === story.id ? story.description : `${story.description.substring(0, 150)}...`}
            </p>
            {readMore !== story.id && (
              <button onClick={() => handleReadMore(story.id)} className="read-more-btn">
                Devamını Oku
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default Home;