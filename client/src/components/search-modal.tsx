import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, User, Eye, Heart, X } from "lucide-react";
import { Link } from "wouter";
import { trackEvent } from "@/lib/analytics";
import type { Story } from "@shared/schema";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const { data: searchResults = [], isLoading, refetch } = useQuery<Story[]>({
    queryKey: ['/api/stories/search', searchQuery, category],
    enabled: searchQuery.length >= 3,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('q', searchQuery);
      if (category !== 'all') {
        params.append('category', category);
      }
      
      const response = await fetch(`/api/stories/search?${params}`);
      if (!response.ok) {
        throw new Error('Arama başarısız');
      }
      return response.json();
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      trackEvent('search', 'content', query);
    }
  };

  const handleStoryClick = (storyId: number, storyTitle: string) => {
    trackEvent('search_result_click', 'content', storyTitle);
    onClose();
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    trackEvent('search_filter', 'category', newCategory);
  };

  const categories = [
    { value: "all", label: "Tümü" },
    { value: "Teknoloji", label: "Teknoloji" },
    { value: "Bilim", label: "Bilim" },
    { value: "Sanat & Felsefe", label: "Sanat & Felsefe" },
    { value: "Psikoloji", label: "Psikoloji" }
  ];

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setCategory("all");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Hikaye Ara</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Hikaye, yazar veya etiket ara..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={category === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {searchQuery.length < 3 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aramaya başlamak için en az 3 karakter girin</p>
              </div>
            ) : isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <div className="w-20 h-16 bg-gray-200 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                          <div className="h-3 bg-gray-200 rounded w-1/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>"{searchQuery}" için sonuç bulunamadı</p>
                <p className="text-sm">Farklı kelimeler deneyebilirsiniz</p>
              </div>
            ) : (
              searchResults.map((story) => (
                <Link
                  key={story.id}
                  href={`/story/${story.id}`}
                  onClick={() => handleStoryClick(story.id, story.title)}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          className="w-20 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold line-clamp-2 mb-2">
                            {story.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {story.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{story.author}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{story.readTime}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge variant="secondary" className="text-xs">
                                {story.category}
                              </Badge>
                              <span className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{story.views}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{story.likes}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}