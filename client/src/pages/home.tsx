import { useState, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { FeaturedStories } from "@/components/featured-stories";
import { CategoriesSection } from "@/components/categories-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { SearchModal } from "@/components/search-modal";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Story } from "@shared/schema";

export default function Home() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: featuredStory } = useQuery<Story>({
    queryKey: ['/api/stories/featured'],
  });

  // Handle scroll events for back to top button and reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setShowBackToTop(scrolled > 300);

      // Update reading progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledPercent = (winScroll / height) * 100;
      
      const progressBar = document.querySelector('.reading-indicator');
      if (progressBar) {
        (progressBar as HTMLElement).style.transform = `scaleX(${scrolledPercent / 100})`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      
      <div className="min-h-screen">
        <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
        
        <main>
          <HeroSection featuredStory={featuredStory} />
          <FeaturedStories />
          <CategoriesSection />
          <NewsletterSection />
        </main>

        <Footer />

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-8 right-8 rounded-full shadow-lg z-40"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        )}

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </div>
    </>
  );
}
