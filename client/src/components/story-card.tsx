import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Share2 } from "lucide-react";
import { Link } from "wouter";
import { trackEvent } from "@/lib/analytics";
import type { Story } from "@shared/schema";

interface StoryCardProps {
  story: Story;
  featured?: boolean;
}

export function StoryCard({ story, featured = false }: StoryCardProps) {
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent('story_like', 'engagement', story.title);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent('story_share', 'engagement', story.title);
  };

  const handleView = () => {
    trackEvent('story_view', 'engagement', story.title);
  };

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${featured ? 'border-2 border-primary/20' : ''}`}>
      <Link href={`/story/${story.id}`} onClick={handleView}>
        <div className="relative">
          <img 
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {featured && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-500 text-white hover:bg-red-600">
                Öne Çıkan
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {story.category}
              </Badge>
              <span className="text-sm text-muted-foreground">{story.date}</span>
            </div>
            
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
              {story.title}
            </h3>
            
            <p className="text-muted-foreground line-clamp-3">
              {story.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{story.authorInitials}</span>
                </div>
                <span className="text-sm font-medium">{story.author}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{story.views > 1000 ? `${(story.views / 1000).toFixed(1)}k` : story.views}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
