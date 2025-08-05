import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SearchModal } from "@/components/search-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Share2, Eye, Clock, Calendar, ChevronDown, ChevronUp, MessageCircle, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStoryFromFirestore, toggleStoryLike, addComment, getStoryComments, incrementStoryViews } from "@/lib/firebase";
import { trackEvent } from "@/lib/analytics";
import { toast } from "@/hooks/use-toast";
import { useUserAuth } from "@/hooks/useUserAuth";

export default function StoryPage() {
  const { id } = useParams();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { user, userProfile } = useUserAuth();
  const queryClient = useQueryClient();

  // Firebase story ID'si varsa Firebase'den al
  const isFirebaseStory = id?.startsWith('firebase-');
  const actualId = isFirebaseStory ? id?.replace('firebase-', '') : id;

  const { data: firebaseStory, isLoading: firebaseLoading } = useQuery({
    queryKey: [`firebase-story-${actualId}`],
    queryFn: () => getStoryFromFirestore(actualId!),
    enabled: !!actualId && isFirebaseStory,
    retry: false
  });

  // Express story için
  const { data: expressStory, isLoading: expressLoading } = useQuery({
    queryKey: [`/api/stories/${actualId}`],
    enabled: !!actualId && !isFirebaseStory,
    retry: false
  });

  const story = firebaseStory || expressStory;
  const isLoading = firebaseLoading || expressLoading;
  
  // Firebase comments (Firebase hikayeleri için aktif)
  const { data: comments = [] } = useQuery({
    queryKey: [`story-comments-${id}`],
    queryFn: () => getStoryComments(id!),
    enabled: !!id && !!firebaseStory,
    retry: false
  });

  // Firebase story için views increment et
  useEffect(() => {
    if (firebaseStory && id) {
      incrementStoryViews(id);
    }
  }, [firebaseStory, id]);

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

  // Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user || !firebaseStory) {
        throw new Error("Authentication required");
      }
      return await toggleStoryLike(id!, user.uid);
    },
    onSuccess: (isLiked) => {
      queryClient.invalidateQueries({ queryKey: [`firebase-story-${actualId}`] });
      toast({
        title: isLiked ? "Beğenildi!" : "Beğeni kaldırıldı",
        description: isLiked ? "Hikayeyi beğendiniz." : "Beğeniniz kaldırıldı.",
      });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
    }
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !userProfile || !firebaseStory) {
        throw new Error("Authentication required");
      }
      return await addComment(id!, user.uid, content, userProfile.displayName);
    },
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: [`story-comments-${id}`] });
      toast({
        title: "Yorum eklendi!",
        description: "Yorumunuz başarıyla eklendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Yorum eklemek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
    }
  });

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Giriş gerekli",
        description: "Beğenmek için giriş yapmalısınız.",
        variant: "destructive",
      });
      return;
    }
    if (!firebaseStory) {
      toast({
        title: "Bilgi",
        description: "Bu özellik sadece yeni hikayeler için kullanılabilir.",
      });
      return;
    }
    likeMutation.mutate();
    if (safeStory) {
      trackEvent('story_like', 'engagement', safeStory.title);
    }
  };

  const handleComment = () => {
    if (!user) {
      toast({
        title: "Giriş gerekli", 
        description: "Yorum yapmak için giriş yapmalısınız.",
        variant: "destructive",
      });
      return;
    }
    if (!commentText.trim()) {
      toast({
        title: "Hata",
        description: "Yorum metni boş olamaz.",
        variant: "destructive",
      });
      return;
    }
    commentMutation.mutate(commentText);
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
            <div
              style={{ whiteSpace: 'pre-wrap' }}
              className="text-lg leading-relaxed"
            >
              {isExpanded ? fullText : previewText}
            </div>
            
            {!isExpanded && fullText.length > previewText.length && (
              <div className="mt-4">
                <Button onClick={toggleExpanded} variant="outline">
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Devamını Oku
                </Button>
              </div>
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

            {/* Comments Section */}
            <div className="space-y-8">
              {/* Comment Form */}
              {firebaseStory && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Yorum Yap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Bu hikaye hakkında düşüncelerinizi paylaşın..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <Button
                          onClick={handleComment}
                          disabled={commentMutation.isPending || !commentText.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {commentMutation.isPending ? "Gönderiliyor..." : "Yorum Gönder"}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          Yorum yapmak için giriş yapmalısınız.
                        </p>
                        <Button asChild>
                          <Link href="/user-login">Giriş Yap</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Comments List */}
              {firebaseStory && comments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Yorumlar ({comments.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {comments.map((comment: any) => (
                      <div key={comment.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {comment.authorName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold">{comment.authorName}</span>
                              <span className="text-sm text-muted-foreground">
                                {comment.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'Şimdi'}
                              </span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Legacy story comment placeholder */}
              {!firebaseStory && (
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Yorum Sistemi</h3>
                    <p className="text-muted-foreground">
                      Bu hikaye için yorum sistemi mevcut değil. Yeni hikayelerimizde yorum yapabilirsiniz.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </>
  );
}
