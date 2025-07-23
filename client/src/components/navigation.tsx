import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ui/theme-provider";
import { Search, Moon, Sun, Menu, X, User, LogOut } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useUserAuth } from "@/hooks/useUserAuth";
import { logout } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  onSearchOpen: () => void;
}

export function Navigation({ onSearchOpen }: NavigationProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userProfile, isLoading } = useUserAuth();

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    trackEvent('theme_toggle', 'ui', newTheme);
  };

  const handleSearchOpen = () => {
    onSearchOpen();
    trackEvent('search_open', 'ui', 'header_search');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Çıkış yapıldı",
        description: "Başarıyla çıkış yapıldı.",
      });
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Çıkış yapılırken hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-cyan-500 transform-origin-left scale-x-0 transition-transform duration-300 z-50 reading-indicator" />
      
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  TEKSANBİL
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Teknoloji | Sanat | Bilim</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors ${location === "/" ? "text-primary font-medium" : ""}`}>
                Anasayfa
              </Link>
              <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
                Hakkında
              </Link>
              <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
                İletişim
              </Link>

              {!isLoading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {userProfile?.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="hidden sm:inline">{userProfile?.displayName || 'Kullanıcı'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/admin-login" className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Yönetici Paneli
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Çıkış Yap
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="default" asChild>
                    <Link href="/user-login">Giriş Yap</Link>
                  </Button>
                )
              )}
            </div>

            {/* Search & Theme Toggle */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleSearchOpen}>
                <Search className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/"
                className="block text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Anasayfa
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hakkında
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                İletişim
              </Link>

              <Button variant="default" className="w-full" asChild>
                <Link href="/admin-login" onClick={() => setIsMobileMenuOpen(false)}>
                  Yönetici
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
