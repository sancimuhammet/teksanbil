import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SearchModal } from "@/components/search-modal";
import { StoryCard } from "@/components/story-card";
import { Button } from "@/components/ui/button";
import { Loader2, Database, RefreshCw } from "lucide-react";
import { getStoriesFromFirestore } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

export default function FirebaseStories() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFirebaseStories = async () => {
    setIsLoading(true);
    try {
      const firebaseStories = await getStoriesFromFirestore();
      setStories(firebaseStories);
      toast({
        title: "Başarılı!",
        description: `Firebase'den ${firebaseStories.length} hikaye alındı.`,
      });
    } catch (error: any) {
      console.error('Firebase stories fetch error:', error);
      toast({
        title: "Firebase Hatası",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFirebaseStories();
  }, []);

  return (
    <>
      <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
      
      <div className="pt-16 min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-cyan/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Database className="w-8 h-8 text-primary" />
                    Firebase Hikayeleri
                  </h1>
                  <p className="text-muted-foreground">
                    Firebase Firestore'dan gelen hikayeler
                  </p>
                </div>
                <Button onClick={fetchFirebaseStories} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Yenile
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stories */}
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Firebase'den hikayeler yükleniyor...</p>
                </div>
              ) : stories.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Henüz Firebase'de hikaye yok</h3>
                  <p className="text-muted-foreground">Admin panelinden yeni hikaye ekleyin.</p>
                </div>
              ) : (
                <div className="grid gap-8">
                  {stories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={{
                        ...story,
                        createdAt: story.createdAt?.toDate?.() || new Date(story.createdAt)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}