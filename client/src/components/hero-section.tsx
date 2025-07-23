import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, Share2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { Link } from "wouter";
import type { Story } from "@shared/schema";

interface HeroSectionProps {
  featuredStory?: Story;
}

export function HeroSection({ featuredStory }: HeroSectionProps) {
  const handleReadStory = () => {
    trackEvent('story_read', 'engagement', 'hero_cta');
  };

  const handleSaveStory = () => {
    trackEvent('story_save', 'engagement', 'hero_save');
  };

  const handleLike = () => {
    trackEvent('story_like', 'engagement', 'hero_like');
  };

  const handleShare = () => {
    trackEvent('story_share', 'engagement', 'hero_share');
  };

  // Default featured story content if none provided
  const story = featuredStory || {
    id: 1,
    title: "Duyguların Oyunu",
    excerpt: "Evrenin kalbinde tüm duygular bir araya geldiğinde, Aşk ve Saflık arasında geçen dokunaklı bir hikaye...",
    author: "Muhammet Şanci",
    authorInitials: "MŞ",
    date: "7/18/2025",
    category: "Duygusal",
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    readTime: "5 dk okuma",
    views: 1200,
    likes: 234,
    tags: ["Duygusal", "Hikaye"],
    content: "",
    featured: true,
    published: true,
    createdAt: new Date(),
  };

  return (
    <section className="pt-16 bg-gradient-to-br from-primary/5 via-background to-cyan/5 min-h-screen flex items-center">
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                Öne Çıkan Hikaye
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="block text-primary">{story.title}</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {story.excerpt}
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{story.authorInitials}</span>
                </div>
                <div>
                  <p className="font-semibold">{story.author}</p>
                  <p className="text-sm text-muted-foreground">{story.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">{story.readTime}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{story.views.toLocaleString()} görüntülenme</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button size="lg" asChild>
                <Link href={`/story/${story.id}`} onClick={handleReadStory}>
                  Hikayeyi Oku
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={handleSaveStory}>
                Kaydet
              </Button>
            </div>
          </div>

          <div className="relative animate-slide-up">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-cyan/20 rounded-3xl blur-2xl" />
            
            <Card className="relative shadow-2xl overflow-hidden cursor-pointer" asChild>
              <Link href={`/story/${story.id}`}>
                <img 
                  src={story.imageUrl} 
                  alt="Romantic heart-shaped light creating emotional atmosphere"
                  className="w-full h-64 object-cover"
                />
              
              <CardContent className="p-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{story.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Vaktiyle... Dünya yeni doğmuştu. Toprak henüz sıcaktı... Rüzgâr, daha adını bilmezdi. Gökyüzü, bir çocuğun bakışı kadar temizdi...
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" onClick={handleLike} className="text-muted-foreground hover:text-red-500">
                        <Heart className="w-5 h-5 mr-2" />
                        {story.likes}
                      </Button>
                      
                      <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground hover:text-primary">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      {story.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
