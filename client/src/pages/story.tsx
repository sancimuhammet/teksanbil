import { useParams, Link } from "wouter";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SearchModal } from "@/components/search-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Share2, Eye, Clock, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStoryFromFirestore } from "@/lib/firebase";
import { trackEvent } from "@/lib/analytics";
import { toast } from "@/hooks/use-toast";
// Firebase verilerini kullandığımız için type import'u kaldırıyoruz

export default function StoryPage() {
  const { id } = useParams();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Önce Firebase'den dene
  const { data: firebaseStory, isLoading: firebaseLoading } = useQuery({
    queryKey: [`firebase-story-${id}`],
    queryFn: () => getStoryFromFirestore(id!),
    enabled: !!id,
    retry: false
  });

  // Firebase'de bulunamazsa Express'den dene
  const { data: expressStory, isLoading: expressLoading } = useQuery({
    queryKey: [`/api/stories/${id}`],
    enabled: !!id && !firebaseStory,
    retry: false
  });

  const story = firebaseStory || expressStory;
  const isLoading = firebaseLoading || expressLoading;

  // Safety check for story properties
  const safeStory = story ? {
    ...story,
    title: story.title || 'Başlıksız',
    excerpt: story.excerpt || '',
    content: story.content || '',
    author: story.author || 'Anonim',
    authorInitials: story.authorInitials || 'A',
    category: story.category || 'genel',
    tags: story.tags || [],
    views: story.views || 0,
    likes: story.likes || 0,
    readTime: story.readTime || '1 dk',
    date: story.date || new Date().toLocaleDateString('tr-TR'),
    imageUrl: story.imageUrl || ''
  } : null;

  const handleLike = () => {
    if (safeStory) {
      trackEvent('story_like', 'engagement', safeStory.title);
      toast({
        title: "Beğenildi!",
        description: "Hikayeyi beğendiniz.",
      });
    }
  };

  const handleShare = async () => {
    if (safeStory) {
      trackEvent('story_share', 'engagement', safeStory.title);
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: safeStory.title,
            text: safeStory.excerpt,
            url: window.location.href,
          });
        } catch (err) {
          // User cancelled sharing
        }
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Kopyalandı",
          description: "Hikaye linki panoya kopyalandı.",
        });
      }
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    trackEvent('story_expand', 'engagement', isExpanded ? 'collapse' : 'expand');
  };

  if (isLoading) {
    return (
      <>
        <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
        <div className="pt-16 min-h-screen bg-background">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-8">
                <div className="h-8 bg-muted rounded w-1/3" />
                <div className="h-12 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-64 bg-muted rounded" />
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!safeStory) {
    return (
      <>
        <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
        <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Hikaye bulunamadı</h1>
            <p className="text-muted-foreground mb-4">Aradığınız hikaye mevcut değil.</p>
            <Button asChild>
              <Link href="/">Ana sayfaya dön</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const previewText = safeStory.content.slice(0, 500);
  const fullText = safeStory.content;

  return (
    <>
      <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
      
      <div className="pt-16 min-h-screen bg-background">
        <article className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" className="mb-8" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ana Sayfaya Dön
              </Link>
            </Button>

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary">{safeStory.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {safeStory.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {safeStory.readTime}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {safeStory.views.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {safeStory.title}
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {safeStory.excerpt}
              </p>

              {/* Author & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{safeStory.authorInitials}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{safeStory.author}</p>
                    <p className="text-sm text-muted-foreground">Yazar</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleLike}>
                    <Heart className="w-4 h-4 mr-2" />
                    {safeStory.likes}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Paylaş
                  </Button>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-8">
              <img
                src={safeStory.imageUrl}
                alt={safeStory.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Story Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
              <div className="text-lg leading-relaxed">
                {isExpanded ? (
                  <div dangerouslySetInnerHTML={{ __html: fullText }} />
                ) : (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: previewText }} />
                    {fullText.length > previewText.length && (
                      <div className="mt-4">
                        <Button onClick={toggleExpanded} variant="outline">
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Devamını Oku
                        </Button>
                      </div>
                    )}
                  </>
                )}
                
                {isExpanded && fullText.length > previewText.length && (
                  <div className="mt-4">
                    <Button onClick={toggleExpanded} variant="outline">
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Devamını Gizle
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {safeStory.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>

            <Separator className="mb-8" />

            {/* Comment Section Placeholder */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Yorum Ekle</h3>
                <p className="text-muted-foreground">
                  Yorum sistemi yakında aktif olacak. Bu hikaye hakkındaki düşüncelerinizi bizimle paylaşmak için geri dönün.
                </p>
              </CardContent>
            </Card>
          </div>
        </article>
      </div>

      <Footer />
    </>
  );
}
