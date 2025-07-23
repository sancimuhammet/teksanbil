import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { SearchModal } from "@/components/search-modal";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Eye, User } from "lucide-react";
import { Link } from "wouter";
import { trackEvent } from "@/lib/analytics";
import { getStoriesFromFirestore } from "@/lib/firebase";

export default function Category() {
  const [, params] = useRoute("/category/:slug");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const categorySlug = params?.slug;

  // Express hikayeleri
  const { data: expressStories, isLoading: expressLoading } = useQuery({
    queryKey: ['/api/stories'],
  });

  // Firebase hikayeleri
  const { data: firebaseStories, isLoading: firebaseLoading } = useQuery({
    queryKey: ['firebase-stories'],
    queryFn: getStoriesFromFirestore,
  });

  // Kategori bilgisi
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const category = categories?.find((cat: any) => cat.slug === categorySlug);

  // Kategori hikayeleri filtrele
  const expressFilteredStories = expressStories?.filter((story: any) => 
    story.category.toLowerCase() === categorySlug?.toLowerCase()
  ) || [];

  const firebaseFilteredStories = firebaseStories?.filter((story: any) => 
    story.category.toLowerCase() === categorySlug?.toLowerCase()
  ) || [];

  // Firebase hikayeler önce, Express hikayeleri sonra
  const allFilteredStories = [...firebaseFilteredStories, ...expressFilteredStories];

  useEffect(() => {
    if (categorySlug) {
      trackEvent('category_view', 'navigation', categorySlug);
    }
  }, [categorySlug]);

  const isLoading = expressLoading || firebaseLoading;

  if (isLoading) {
    return (
      <>
        <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
        <div className="pt-16 min-h-screen bg-background">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
        <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Kategori bulunamadı</h1>
            <p className="text-muted-foreground mb-4">Aradığınız kategori mevcut değil.</p>
            <Button asChild>
              <Link href="/">Ana sayfaya dön</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
      
      <div className="pt-16 min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-8" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Link>
          </Button>

          {/* Category Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">{category.description}</p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {allFilteredStories.length} hikaye
            </Badge>
          </div>

          {/* Stories Grid */}
          {allFilteredStories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allFilteredStories.map((story: any) => (
                <Link key={story.id} href={`/story/${story.id}`}>
                  <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    {story.imageUrl && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={story.imageUrl} 
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{story.category}</Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                          {story.title}
                        </h3>
                        
                        <p className="text-muted-foreground line-clamp-3">
                          {story.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{story.author}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {story.date}
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {story.views || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">Bu kategoride henüz hikaye yok</h2>
              <p className="text-muted-foreground mb-8">
                {category.name} kategorisinde henüz yayınlanmış bir hikaye bulunmuyor.
              </p>
              <Button asChild>
                <Link href="/">Diğer hikayeleri keşfet</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}