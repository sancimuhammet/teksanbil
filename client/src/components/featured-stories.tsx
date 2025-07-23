import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StoryCard } from "./story-card";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import { getStoriesFromFirestore } from "@/lib/firebase";
import { useLocation } from "wouter";
import type { Story } from "@shared/schema";

export function FeaturedStories() {
  const [, setLocation] = useLocation();
  
  // Firebase hikayeleri (ana kaynak)
  const { data: firebaseStories = [] } = useQuery({
    queryKey: ['firebase-stories'],
    queryFn: getStoriesFromFirestore,
    retry: false,
    staleTime: 5 * 60 * 1000
  });

  // Express hikayeleri (yedek/eski hikayeler)
  const { data: expressStories = [], isLoading } = useQuery<Story[]>({
    queryKey: ['/api/stories'],
  });

  // Firebase önce, sonra Express (sizin tercihiniz)
  const combinedStories = [
    ...firebaseStories.map((fbStory: any) => ({
      id: `firebase-${fbStory.id}`,
      title: fbStory.title || '',
      excerpt: fbStory.excerpt || '',
      author: fbStory.author || 'Anonim',
      authorInitials: fbStory.authorInitials || 'A',
      category: fbStory.category || 'Genel',
      tags: fbStory.tags || [],
      imageUrl: fbStory.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400',
      readTime: fbStory.readTime || '3 dk',
      date: fbStory.date || new Date().toLocaleDateString('tr-TR'),
      views: fbStory.views || 0,
      likes: fbStory.likes || 0,
      featured: false,
      published: true,
      content: fbStory.content || '',
      createdAt: fbStory.createdAt?.toDate?.() || new Date()
    })),
    ...expressStories
  ];
  const stories = combinedStories.slice(0, 6);

  const handleLoadMore = () => {
    trackEvent('load_more_stories', 'engagement', 'featured_section');
    setLocation('/firebase-stories'); // Tüm Firebase hikayelerini gösteren sayfaya yönlendir
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
