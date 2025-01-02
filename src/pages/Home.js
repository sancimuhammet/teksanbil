import React, { useState } from 'react'; // useState'i burada import ediyoruz
import './Home.css';

const Home = () => {
  const stories = [
{
      id: 1,
      title: "Ofansif Defansın Keşfi: Langırt'ın Stratejik Devrimi",
      
      description: `2024 yılı Ekim ayında, askerlik sürecinde, langırt masasında gerçekleşen bir gelişme, oyunun temel kurallarını yeniden şekillendirecek şekilde tarihe geçti. Bu buluş, langırt dünyasında sessiz sedasız devrim yaratmış ve strateji oyunlarına bambaşka bir boyut kazandırmıştır.

Birçok insan için langırt, sadece basit bir eğlence aracıdır; ancak bazıları için, bu tahtada şekillenen her hareket, derin bir stratejik anlam taşır. İşte bu noktada, "Ofansif Defans" kavramı doğdu. Bu kavram, ilk kez Muhammet Şancı ve M. Ali Evrankaya'nın 301 Sami Özer ve Ömer Altaya karşı oluşturdukları takım tarafından keşfedildi.

Bu yeni strateji, savunmanın ötesine geçerek, defans oyuncusunun aktif şekilde hücum yapabilme yeteneğini ortaya koyuyordu. Geleneksel langırt stratejilerinde defans oyuncusu, sadece rakiplerin topunu engellemeye çalışır. Ancak "Ofansif Defans"ta, defans oyuncusunun amacı yalnızca topu savunmak değil, aynı zamanda topu rakip kaleye yönlendirmektir. Bu yaklaşım, yalnızca savunma değil, aynı zamanda stratejik bir hücum biçimi olarak da işlev görüyordu.

Bu devrimsel strateji, ilk başta arkadaşlar tarafından şaşkınlıkla karşılandı. Ancak zamanla, Sami Özer ve Ömer Altaya'nın karşısında elde edilen sürekli zaferlerle birlikte, bu strateji langırt tarihindeki önemli bir dönüm noktasını işaret etti. Muhammet Şanci'nin "ofansif defans" yaklaşımını benimsemesi, sadece oyun içindeki zaferleri değil, aynı zamanda askerliğin stresli ortamında arkadaşlar arasında bir bağ oluşturdu.

O esnada orada bulunan arkadaşları Serdar Abi, Muharrem Dayı, son sigara bükücü Ali, Mehmet Hoca, Ümit Bey ve niceleri bu anlara şahit olmuştu. Ve tabi ki kara gölge Harun Erende oradaydı. Her biri, bu anın tarihsel önemine tanıklık etti ve langırt tahtasında gerçekleşen bu stratejik devrimi gözler önüne serdi.

Bu keşif, langırt masasında sadece oyun oynamaktan çok daha fazlasını ifade ediyordu. "Ofansif Defans" stratejisi, her hamlede mantıklı bir düşünme, hızlı tepki verme ve en önemlisi yaratıcı bir strateji geliştirme becerilerini ön plana çıkarıyordu. Muhammet Şanci'nin bu stratejiyi keşfetmesi ve ardından uygulaması, langırtın yalnızca eğlencelik bir oyun değil, aynı zamanda bir düşünce ve strateji becerisi geliştirme alanı olduğunu gözler önüne serdi.

Bugün, "Ofansif Defans", langırtın yalnızca kurallarına değil, aynı zamanda stratejisine de yön veren bir terim olarak kabul edilmektedir. Langırt tahtasında savunma yaparken aynı anda hücum etme yeteneği, langırtın "hızlı düşünme" gerektiren yapısını bir üst seviyeye taşıyan bir gelişme olarak tarihe geçmiştir.`,
      Image: "/public/images/langirt.png"
    },
    {
        id: 2,
        title: "Kahramanın Yolculuğu: Bir Bilgisayar Oyununun Anatomisi",
        description: `Yakında sizlerle...` // kısa versiyon
        
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