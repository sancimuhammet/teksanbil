import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StoryCard } from "./story-card";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import { getStoriesFromFirestore } from "@/lib/firebase";
import type { Story } from "@shared/schema";

export function FeaturedStories() {
  // Ana hikayeler Express'den (site yapısında saklı original content)
  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ['/api/stories'],
  });

  const handleLoadMore = () => {
    trackEvent('load_more_stories', 'engagement', 'featured_section');
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Son Hikayeler</h2>
            <p className="text-xl text-muted-foreground">Teknoloji, sanat ve bilim dünyasından en güncel içerikler</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-background rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-6 bg-muted rounded" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Son Hikayeler</h2>
          <p className="text-xl text-muted-foreground">Teknoloji, sanat ve bilim dünyasından en güncel içerikler</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <StoryCard 
              key={story.id} 
              story={story} 
              featured={index === stories.length - 1} // Make the last story featured for visual variety
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" onClick={handleLoadMore}>
            Daha Fazla Hikaye Yükle
          </Button>
        </div>
      </div>
    </section>
  );
}
