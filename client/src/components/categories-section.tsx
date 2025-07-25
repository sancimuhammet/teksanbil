import { Monitor, FlaskConical, Book, Lightbulb, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import { getStoriesFromFirestore } from "@/lib/firebase";
import type { Category } from "@shared/schema";

const iconMap = {
  Monitor,
  FlaskConical,
  Flask: FlaskConical, // Flask alias için
  Book,
  Lightbulb,
};

export function CategoriesSection() {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Firebase hikayelerini çek
  const { data: firebaseStories = [], isLoading: firebaseLoading } = useQuery({
    queryKey: ['firebase-stories'],
    queryFn: getStoriesFromFirestore,
  });

  // Kategori hikaye sayılarını Firebase'den hesapla
  const categoriesWithCounts = categories.map(category => {
    const storyCount = firebaseStories.filter((story: any) => 
      story.category?.toLowerCase() === category.name.toLowerCase()
    ).length;
    
    return {
      ...category,
      storyCount: storyCount
    };
  });

  const handleCategoryClick = (categoryName: string) => {
    trackEvent('category_click', 'navigation', categoryName);
  };

  // Sadece categories loading'i bekle, Firebase stories optional
  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Kategoriler</h2>
            <p className="text-xl text-muted-foreground">İlgi alanınıza göre hikayeler keşfedin</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl p-8 bg-muted animate-pulse">
                <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg mb-4" />
                <div className="h-6 bg-muted-foreground/20 rounded mb-2" />
                <div className="h-4 bg-muted-foreground/20 rounded mb-4 w-2/3" />
                <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Eğer kategoriler varsa göster
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Kategoriler</h2>
          <p className="text-xl text-muted-foreground">İlgi alanınıza göre hikayeler keşfedin</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesWithCounts.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Monitor;
            
            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="group relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 text-white shadow-lg hover:shadow-xl rounded-lg">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent group-hover:from-black/25 transition-all" />
                  
                  <div className="relative z-10 p-8">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center text-sm">
                      <span>{category.storyCount} hikaye</span>
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
