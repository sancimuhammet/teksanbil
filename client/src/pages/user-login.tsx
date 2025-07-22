import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { loginWithEmail, registerWithEmail } from "@/lib/firebase";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { LogIn, UserPlus } from "lucide-react";

export default function UserLogin() {
  const [, setLocation] = useLocation();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginWithEmail(loginData.email, loginData.password);
      toast({
        title: "Başarılı!",
        description: "Giriş yapıldı. Yönlendiriliyorsunuz...",
      });
      setTimeout(() => setLocation('/'), 1000);
    } catch (error: any) {
      toast({
        title: "Hata!",
        description: error.message || "Giriş yapılırken hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Hata!",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive",
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Hata!",
        description: "Şifre en az 6 karakter olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await registerWithEmail(registerData.email, registerData.password, registerData.displayName);
      toast({
        title: "Başarılı!",
        description: "Hesap oluşturuldu. Yönlendiriliyorsunuz...",
      });
      setTimeout(() => setLocation('/'), 1000);
    } catch (error: any) {
      toast({
        title: "Hata!",
        description: error.message || "Hesap oluşturulurken hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
      
      <div className="pt-16 min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Kullanıcı Girişi</h1>
              <p className="text-muted-foreground">
                Hikayelerimizi beğenebilmek, yorum yapabilmek ve daha fazlası için giriş yapın.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="login" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                    <TabsTrigger value="register">Üye Ol</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                          id="email"
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        <LogIn className="w-4 h-4 mr-2" />
                        {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Ad Soyad</Label>
                        <Input
                          id="displayName"
                          type="text"
                          value={registerData.displayName}
                          onChange={(e) => setRegisterData({...registerData, displayName: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registerEmail">E-posta</Label>
                        <Input
                          id="registerEmail"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="registerPassword">Şifre</Label>
                        <Input
                          id="registerPassword"
                          type="password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isLoading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <Separator className="my-6" />

                <p className="text-sm text-muted-foreground text-center">
                  Hesabınızla hikayelerimizi beğenebilir, yorum yapabilir ve kişisel tercihlerinizi kaydedebilirsiniz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}