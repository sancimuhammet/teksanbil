import React from "react";
import StoryCard from "../components/StoryCard";

function Stories() {
  const storyList = [
    { title: "Rodin ve Düşünen Adam: Taşın İçindeki İnsan", description: `Paris’te bir parkın ortasında, başını ellerine dayamış, derin düşüncelere dalmış bir figür: "Düşünen Adam." Dünyaca ünlü bu heykel, Auguste Rodin’in dehasının ve sanatın derin etkisinin bir simgesidir. Ancak "Düşünen Adam" sadece bir heykel değil; insan zihninin ve varoluşun karmaşıklığını anlatan bir öyküdür.

Rodin, "Düşünen Adam"ı 1880'lerde, büyük bir projenin parçası olarak tasarladı: "Cehennem Kapıları." Bu proje, Dante’nin İlahi Komedya’sından ilham alıyordu. Heykel, aslında Dante’nin bir yansıması olarak yaratılmıştı; cehennem kapısının tepesinde oturup, insanlığın acılarını ve ahlaki ikilemlerini düşünen bir figür.

Ancak zamanla, "Düşünen Adam" bu bağlamdan koptu ve kendi başına bir anlam kazandı. İnsanlar bu figürü, kendi varoluş mücadeleleriyle ilişkilendirdi. Felsefeciler, bilim insanları ve sıradan insanlar, onun duruşunda, evrensel bir düşünme ve sorgulama halini buldu. Rodin, bu heykeli yaratırken, taşı sadece şekillendirmemiş; ona ruh üflemişti.

Peki, taş bir heykel nasıl olur da bu kadar güçlü bir etki yaratabilir? Cevap basit: Rodin, taşın içinde zaten var olan insanı bulmuştu. Kendisi şöyle derdi:
"Ben taşları yontmuyorum. Onların içindeki figürü özgür bırakıyorum."

"Düşünen Adam," taşın içinden özgür bırakılmış bir ruhun simgesidir. O, bize düşünmenin, sorgulamanın ve insan olmanın ne anlama geldiğini hatırlatır. Bu heykel, zamanın ve mekanın ötesine geçen bir çağrı yapar: "Kim olduğunuzu ve neden burada olduğunuzu düşünün.` },
    { title: "Sanatın Gücü", description: "Sanat ve teknoloji nasıl birleşiyor?", image: "/art.jpg" },
  ];

  return (
    <div className="stories">
      <h2>Hikayeler</h2>
      <div className="story-list">
        {storyList.map((story, index) => (
          <StoryCard key={index} {...story} />
        ))}
      </div>
    </div>
  );
}

export default Stories;
