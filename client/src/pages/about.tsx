import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SearchModal } from "@/components/search-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, BookOpen, Lightbulb } from "lucide-react";

export default function About() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const stats = [
    { icon: BookOpen, label: "Yayınlanan Hikaye", value: "100+" },
    { icon: Users, label: "Okuyucu", value: "10K+" },
    { icon: Heart, label: "Beğeni", value: "5K+" },
    { icon: Lightbulb, label: "Kategori", value: "4" },
  ];

  return (
    <>
      <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
      
      <div className="pt-16 min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-cyan/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Hakkımızda
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                TEKSANBİL, teknoloji, sanat ve bilim dünyasından ilham verici hikayeleri bir araya getiren 
                modern bir platform. Merakınızı besleyen, düşündüren ve ilham veren içerikler üretiyoruz.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="secondary" className="px-4 py-2">Teknoloji</Badge>
                <Badge variant="secondary" className="px-4 py-2">Sanat</Badge>
                <Badge variant="secondary" className="px-4 py-2">Bilim</Badge>
                <Badge variant="secondary" className="px-4 py-2">Felsefe</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-6">Misyonumuz</h2>
                <p className="text-lg text-muted-foreground">
                  Bilgiyi paylaşmak, merak duygusunu beslemek ve insanları düşünmeye teşvik etmek
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Kaliteli İçerik</h3>
                    <p className="text-muted-foreground">
                      Her hikaye dikkatle araştırılır, yazılır ve editörlük sürecinden geçirilir. 
                      Amacımız okuyucularımıza en kaliteli deneyimi sunmak.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Topluluk</h3>
                    <p className="text-muted-foreground">
                      Okuyucularımızla güçlü bir bağ kurmayı hedefliyoruz. Geri bildirimleriniz 
                      ve önerileriniz bizim için çok değerli.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Author Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-6">Yazar Hakkında</h2>
              </div>
              
              <Card className="max-w-3xl mx-auto">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-4xl">MŞ</span>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-4">Muhammet Şanci</h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        Teknoloji, bilim ve sanat alanlarına olan tutkusu ile yazılarında 
                        karmaşık konuları sade bir dille anlatmaya çalışan bir yazar. 
                        Her hikayede okuyucuları düşündürmeyi ve ilham vermeyi hedefler.
                      </p>
                      <p className="text-muted-foreground">
                        "Bilginin paylaşıldıkça çoğaldığına, merakın beslendiğinde büyüdüğüne inanıyorum."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}