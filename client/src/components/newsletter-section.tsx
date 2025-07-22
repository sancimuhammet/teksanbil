import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const subscriptionMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest('POST', '/api/newsletter/subscribe', { email });
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "E-bültenimize başarıyla abone oldunuz.",
      });
      setEmail("");
      trackEvent('newsletter_subscribe', 'engagement', 'success');
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message || "Abonelik sırasında bir hata oluştu.",
        variant: "destructive",
      });
      trackEvent('newsletter_subscribe', 'engagement', 'error');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    trackEvent('newsletter_subscribe', 'engagement', 'attempt');
    subscriptionMutation.mutate(email);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-cyan-600">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Hiçbir Hikayeyi Kaçırmayın</h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Haftalık bültenimize abone olun ve en yeni hikayeleri ilk siz okuyun
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white text-gray-900 border-none focus:ring-4 focus:ring-white/30"
              required
            />
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={subscriptionMutation.isPending}
              className="bg-white text-primary hover:bg-gray-100"
            >
              {subscriptionMutation.isPending ? "Abone Oluyor..." : "Abone Ol"}
            </Button>
          </form>
          
          <p className="text-sm text-primary-foreground/60 mt-4">
            Spam yapmıyoruz. İstediğiniz zaman aboneliği iptal edebilirsiniz.
          </p>
        </div>
      </div>
    </section>
  );
}
