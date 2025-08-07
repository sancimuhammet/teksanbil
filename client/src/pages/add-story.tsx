import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin-guard";
import { useUserAuth } from "@/hooks/useUserAuth";
import { checkAdminAccess } from "@/lib/adminAuth";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SearchModal } from "@/components/search-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Save, Eye, X, Upload, FileText, Trash2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { addStoryToFirestore, logout, getStoriesFromFirestore, deleteStoryFromFirestore, updateStoryInFirestore } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AddStory() {
  const { user } = useUserAuth();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "Muhammet Şanci",
    authorInitials: "MŞ",
    category: "",
    tags: [] as string[],
    imageUrl: "",
    readTime: "",
    featured: false,
    published: true
  });
  const [newTag, setNewTag] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStoryManagement, setShowStoryManagement] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);

  // Firebase'den hikayeleri getir
  const { data: firebaseStories, isLoading: storiesLoading } = useQuery({
    queryKey: ['firebase-stories'],
    queryFn: () => getStoriesFromFirestore(),
  });

  const categories = [
    { value: "teknoloji", label: "Teknoloji" },
    { value: "bilim", label: "Bilim" },
    { value: "sanat-felsefe", label: "Sanat & Felsefe" },
    { value: "psikoloji", label: "Psikoloji" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Çıkış Yapıldı",
        description: "Başarıyla çıkış yaptınız.",
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    trackEvent(editingStoryId ? 'story_update' : 'story_create', 'content', 'attempt');

    try {
      const storyData = {
        ...formData,
        // createdAt sadece yeni hikayeler için ayarlanır, güncellenmez
        // date alanı Firebase'de güncellenmez, sadece ilk oluşturulduğunda ayarlanır
        // views ve likes da burada güncellenmez
      };

      if (editingStoryId) {
        // Mevcut hikayeyi güncelle
        await updateStoryInFirestore(editingStoryId, storyData);
        toast({
          title: "Başarılı!",
          description: "Hikaye başarıyla güncellendi.",
        });
        trackEvent('story_update', 'content', 'success');
      } else {
        // Yeni hikaye ekle
        const newStoryData = {
          ...storyData,
          date: new Date().toLocaleDateString('tr-TR'), // Sadece yeni hikaye için tarih ekle
          createdAt: new Date(),
          views: 0,
          likes: 0
        };
        await addStoryToFirestore(newStoryData);
        toast({
          title: "Başarılı!",
          description: "Hikaye başarıyla kaydedildi.",
        });
        trackEvent('story_create', 'content', 'success');
      }
      
      // Formu sıfırla ve düzenleme modundan çık
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        author: "Muhammet Şanci",
        authorInitials: "MŞ",
        category: "",
        tags: [],
        imageUrl: "",
        readTime: "",
        featured: false,
        published: true
      });
      setEditingStoryId(null); // Düzenleme modundan çık

      // Cache'i yenile
      queryClient.invalidateQueries({ queryKey: ['firebase-stories'] });
      
    } catch (error: any) {
      console.error('Story operation error:', error);
      toast({
        title: "Hata",
        description: "Hikaye kaydedilirken/güncellenirken bir hata oluştu: " + error.message,
        variant: "destructive",
      });
      trackEvent(editingStoryId ? 'story_update' : 'story_create', 'content', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
    trackEvent('story_preview', 'content', isPreview ? 'close' : 'open');
  };

  const handleDeleteStory = async (storyId: string, storyTitle: string) => {
    if (!confirm(`"${storyTitle}" adlı hikayeyi silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await deleteStoryFromFirestore(storyId);
      
      toast({
        title: "Başarılı!",
        description: "Hikaye başarıyla silindi.",
      });

      // Cache'i yenile
      queryClient.invalidateQueries({ queryKey: ['firebase-stories'] });
      
      trackEvent('story_deleted', 'content', 'success');
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: "Hata",
        description: "Hikaye silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditStory = (storyId: string) => {
    setEditingStoryId(storyId);
    setShowStoryManagement(false); // Form görünümüne geç
    trackEvent('story_edit_start', 'content', storyId);
  };

  useEffect(() => {
    if (editingStoryId && firebaseStories) {
      const storyToEdit = firebaseStories.find((story: any) => story.id === editingStoryId);
      if (storyToEdit) {
        setFormData({
          title: storyToEdit.title || "",
          excerpt: storyToEdit.excerpt || "",
          content: storyToEdit.content || "",
          author: storyToEdit.author || "Muhammet Şanci",
          authorInitials: storyToEdit.authorInitials || "MŞ",
          category: storyToEdit.category || "",
          tags: storyToEdit.tags || [],
          imageUrl: storyToEdit.imageUrl || "",
          readTime: storyToEdit.readTime || "",
          featured: storyToEdit.featured || false,
          published: storyToEdit.published || true
        });
        setShowStoryManagement(false); // Form görünümüne geç
        setIsPreview(false); // Önizleme modundan çık
      }
    }
  }, [editingStoryId, firebaseStories]);

  return (
    <AdminGuard>
      <Navigation onSearchOpen={() => setIsSearchModalOpen(true)} />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
      
      <div className="pt-16 min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-cyan/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {editingStoryId ? "Hikayeyi Düzenle" : "Yeni Hikaye Ekle"}
                  </h1>
                  <p className="text-muted-foreground">
                    Admin paneli - Yeni hikaye oluşturun
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Hoşgeldin, {user?.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePreview}>
                    <Eye className="w-4 h-4 mr-2" />
                    {isPreview ? "Editör" : "Önizle"}
                  </Button>
                  <Button variant="secondary" onClick={() => setShowStoryManagement(!showStoryManagement)}>
                    <FileText className="w-4 h-4 mr-2" />
                    {showStoryManagement ? "Form" : "Yönet"}
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    Çıkış Yap
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {showStoryManagement ? (
                /* Story Management Mode */
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        Hikaye Yönetimi
                      </CardTitle>
                      <p className="text-muted-foreground">Firebase'deki hikayeleri yönetin</p>
                    </CardHeader>
                    <CardContent>
                      {storiesLoading ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Hikayeler yükleniyor...</p>
                        </div>
                      ) : firebaseStories && firebaseStories.length > 0 ? (
                        <div className="space-y-4">
                          {firebaseStories.map((story: any) => (
                            <div 
                              key={story.id} 
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{story.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {story.author} • {story.category} • {story.date}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {story.views || 0} görüntülenme • {story.likes || 0} beğeni
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditStory(story.id)}
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Düzenle
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteStory(story.id, story.title)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Sil
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Henüz Firebase'de hikaye bulunmuyor.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : !isPreview ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Temel Bilgiler
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Title */}
                      <div>
                        <Label htmlFor="title">Başlık *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="Hikayenizin başlığını girin"
                          className="mt-2"
                          required
                        />
                      </div>

                      {/* Excerpt */}
                      <div>
                        <Label htmlFor="excerpt">Özet *</Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => handleInputChange('excerpt', e.target.value)}
                          placeholder="Hikayenizin kısa özeti (2-3 cümle)"
                          rows={3}
                          className="mt-2"
                          required
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <Label htmlFor="content">İçerik *</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => handleInputChange('content', e.target.value)}
                          placeholder="Hikayenizin tam içeriğini yazın"
                          rows={15}
                          className="mt-2"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Kategorize</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Category */}
                      <div>
                        <Label>Kategori *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Tags */}
                      <div>
                        <Label>Etiketler</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Etiket ekle"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          />
                          <Button type="button" onClick={addTag} variant="outline">
                            <PlusCircle className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer">
                              {tag}
                              <X 
                                className="w-3 h-3 ml-2" 
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Medya & Meta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Image URL */}
                      <div>
                        <Label htmlFor="imageUrl">Görsel URL</Label>
                        <Input
                          id="imageUrl"
                          value={formData.imageUrl}
                          onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="mt-2"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Unsplash veya başka bir kaynak kullanabilirsiniz
                        </p>
                      </div>

                      {/* Read Time */}
                      <div>
                        <Label htmlFor="readTime">Okuma Süresi</Label>
                        <Input
                          id="readTime"
                          value={formData.readTime}
                          onChange={(e) => handleInputChange('readTime', e.target.value)}
                          placeholder="5 dk okuma"
                          className="mt-2"
                        />
                      </div>

                      {/* Author */}
                      <div>
                        <Label htmlFor="author">Yazar</Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => handleInputChange('author', e.target.value)}
                          className="mt-2"
                        />
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={(checked) => handleInputChange('featured', checked)}
                          />
                          <Label htmlFor="featured">Öne çıkarılsın</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) => handleInputChange('published', checked)}
                          />
                          <Label htmlFor="published">Yayınlansın</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setLocation('/');
                        setEditingStoryId(null); // İptal edildiğinde düzenleme modundan çık
                        setFormData({ // Formu sıfırla
                          title: "", excerpt: "", content: "", author: "Muhammet Şanci", authorInitials: "MŞ",
                          category: "", tags: [], imageUrl: "", readTime: "", featured: false, published: true
                        });
                      }}
                    >
                      İptal
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      size="lg"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {isSubmitting ? "Kaydediliyor..." : (editingStoryId ? "Hikayeyi Güncelle" : "Hikayeyi Kaydet")}
                    </Button>
                  </div>
                </form>
              ) : (
                /* Preview Mode */
                <div className="space-y-8">
                  <Card>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {formData.imageUrl && (
                          <img 
                            src={formData.imageUrl || "/placeholder.svg"} 
                            alt={formData.title}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        )}
                        
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{formData.category}</Badge>
                            {formData.featured && (
                              <Badge variant="default">Öne Çıkan</Badge>
                            )}
                          </div>
                          
                          <h1 className="text-3xl font-bold">{formData.title || "Başlık Yok"}</h1>
                          
                          <p className="text-lg text-muted-foreground">
                            {formData.excerpt || "Özet yok"}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{formData.author}</span>
                            {formData.readTime && <span>• {formData.readTime}</span>}
                          </div>
                          
                          <div className="prose max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }} />
                          </div>
                          
                          {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t">
                              {formData.tags.map((tag) => (
                                <Badge key={tag} variant="outline">{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </AdminGuard>
  );
}
