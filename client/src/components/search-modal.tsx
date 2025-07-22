import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Link } from "wouter";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import type { Story } from "@shared/schema";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: searchResults = [], isLoading } = useQuery<Story[]>({
    queryKey: ['/api/stories/search', searchTerm, selectedCategory],
    enabled: searchTerm.length > 2,
  });

  const categories = [
    { value: "all", label: "Tüm Kategoriler" },
    { value: "teknoloji", label: "Teknoloji" },
    { value: "bilim", label: "Bilim" },
    { value: "hikaye", label: "Hikaye" },
    { value: "psikoloji", label: "Psikoloji" },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 2) {
      trackEvent('search', 'engagement', term);
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    trackEvent('search_filter', 'engagement', category);
  };

  const handleResultClick = (story: Story) => {
    trackEvent('search_result_click', 'engagement', story.title);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm("");
      setSelectedCategory("all");
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Hikaye Arama</DialogTitle>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Hikaye, yazar veya konu ara..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 text-xl border-none focus:ring-0 p-0 h-auto bg-transparent"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category.value)}
                className="text-sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {searchTerm.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Arama yapmaya başlayın</p>
            </div>
          ) : searchTerm.length < 3 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">En az 3 karakter girin</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-xl animate-pulse">
                  <div className="w-16 h-16 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">"{searchTerm}" için sonuç bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((story) => (
                <Link
                  key={story.id}
                  href={`/story/${story.id}`}
                  onClick={() => handleResultClick(story)}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{story.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {story.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{story.author}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
