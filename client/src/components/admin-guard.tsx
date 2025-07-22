import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUserAuth } from "@/hooks/useUserAuth";
import { checkAdminAccess, getAdminError } from "@/lib/adminAuth";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, AlertTriangle } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user, isLoading } = useUserAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !checkAdminAccess(user)) {
      setLocation('/admin-login');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!checkAdminAccess(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
              <h2 className="text-2xl font-bold">Yetkisiz Erişim</h2>
              <p className="text-muted-foreground">
                {getAdminError(user)}
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/admin-login">Yönetici Girişi</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Ana Sayfaya Dön</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};