import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn, Shield, AlertTriangle } from "lucide-react";
import { loginWithEmail, logout } from "@/lib/firebase";
import { checkAdminAccess, getAdminError } from "@/lib/adminAuth";
import { useUserAuth } from "@/hooks/useUserAuth";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { user } = useUserAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const firebaseUser = await loginWithEmail(formData.email, formData.password);
      
      // Email kontrolü - sadece yönetici emaillerine izin ver
      if (!checkAdminAccess(firebaseUser)) {
        await logout(); // Hemen çıkış yap
        setError("Bu hesap yönetici yetkisine sahip değil.");
        setIsLoading(false);
        return;
      }
      toast({
        title: "Başarılı!",
        description: `Hoşgeldiniz, ${firebaseUser.email}`,
      });
      trackEvent('admin_login', 'auth', 'success');
      setLocation('/add-story'); // Admin girişi sonrası hikaye ekleme sayfasına git
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "Giriş yapılırken bir hata oluştu.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Şifre hatalı.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Geçersiz e-posta adresi.";
      }
      
      setError(errorMessage);
      trackEvent('admin_login', 'auth', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-cyan/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Yönetici Girişi</CardTitle>
          <p className="text-muted-foreground">
            Hikaye yönetimi için giriş yapın
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="E-posta adresiniz"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/')}
              className="text-muted-foreground"
            >
              ← Ana Sayfaya Dön
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}