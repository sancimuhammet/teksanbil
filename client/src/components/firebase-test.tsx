import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addStoryToFirestore, getStoriesFromFirestore, db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

export const FirebaseTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const testFirebaseConnection = async () => {
    setIsLoading(true);
    setResult("");
    
    try {
      // Test Firestore bağlantısı
      console.log('Firebase Config:', {
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'SET' : 'NOT SET',
        appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'SET' : 'NOT SET'
      });
      
      const testStory = {
        title: "Test Hikayesi",
        content: "Bu bir test hikayesidir",
        author: "Test",
        category: "teknoloji",
        tags: ["test"],
        date: new Date().toLocaleDateString('tr-TR')
      };
      
      const docId = await addStoryToFirestore(testStory);
      setResult(`✅ Firebase bağlantısı başarılı! Test hikayesi eklendi: ${docId}`);
      
      toast({
        title: "Başarılı!",
        description: "Firebase Firestore bağlantısı çalışıyor.",
      });
      
    } catch (error: any) {
      setResult(`❌ Firebase hatası: ${error.message}`);
      console.error('Firebase test error:', error);
      
      toast({
        title: "Firebase Hatası",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testFirebaseRead = async () => {
    setIsLoading(true);
    
    try {
      const stories = await getStoriesFromFirestore();
      setResult(`✅ Firebase'den ${stories.length} hikaye okundu`);
      console.log('Firebase stories:', stories);
    } catch (error: any) {
      setResult(`❌ Firebase okuma hatası: ${error.message}`);
      console.error('Firebase read error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Firebase Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testFirebaseConnection} disabled={isLoading}>
          {isLoading ? "Test Ediliyor..." : "Firebase Bağlantısını Test Et"}
        </Button>
        
        <Button onClick={testFirebaseRead} disabled={isLoading} variant="outline">
          Firestore'dan Veri Oku
        </Button>
        
        {result && (
          <Alert>
            <AlertDescription>{result}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};