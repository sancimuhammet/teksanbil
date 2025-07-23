import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Github, Instagram } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function Footer() {
  const handleSocialClick = (platform: string) => {
    trackEvent('social_click', 'engagement', platform);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                  TEKSANBİL
                </h3>
                <p className="text-xs text-gray-400">Teknoloji | Sanat | Bilim</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Teknoloji, sanat ve bilim dünyasından ilham verici hikayeler ve derinlemesine analizler. 
              Geleceği şekillendiren fikirleri keşfedin.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary"
                asChild
              >
                <a 
                  href="https://twitter.com/teksanbil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick('twitter')}
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary"
                asChild
              >
                <a 
                  href="https://instagram.com/teksanbil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick('instagram')}
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary"
                onClick={() => handleSocialClick('linkedin')}
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary"
                onClick={() => handleSocialClick('github')}
              >
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Anasayfa</Link></li>
              <li><Link href="/stories" className="text-gray-300 hover:text-white transition-colors">Tüm Hikayeler</Link></li>
              <li><Link href="/categories" className="text-gray-300 hover:text-white transition-colors">Kategoriler</Link></li>
              <li><Link href="/authors" className="text-gray-300 hover:text-white transition-colors">Yazarlar</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Hakkında</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Destek</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors">Yardım Merkezi</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Kullanım Şartları</Link></li>
              <li><Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">Çerez Politikası</Link></li>
              <li><Link href="/notifications" className="text-gray-300 hover:text-white transition-colors">Bildirimleri Yönet</Link></li>
              <li><Link href="/report" className="text-gray-300 hover:text-white transition-colors">Sorun Bildir</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {currentYear} TEKSANBİL. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Firebase ile güçlendirildi</span>
            <span>•</span>
            <span>Vercel üzerinde barındırılır</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
