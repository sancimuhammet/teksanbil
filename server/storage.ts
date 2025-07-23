import { stories, categories, newsletters, type Story, type InsertStory, type Category, type InsertCategory, type Newsletter, type InsertNewsletter } from "@shared/schema";

export interface IStorage {
  // Stories
  getStory(id: number): Promise<Story | undefined>;
  getStories(): Promise<Story[]>;
  getFeaturedStory(): Promise<Story | undefined>;
  searchStories(query: string, category?: string): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStoryViews(id: number): Promise<void>;
  updateStoryLikes(id: number): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Newsletter
  subscribeNewsletter(email: string): Promise<Newsletter>;
  unsubscribeNewsletter(email: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private stories: Map<number, Story>;
  private categories: Map<number, Category>;
  private newsletters: Map<number, Newsletter>;
  private currentStoryId: number;
  private currentCategoryId: number;
  private currentNewsletterId: number;

  constructor() {
    this.stories = new Map();
    this.categories = new Map();
    this.newsletters = new Map();
    this.currentStoryId = 1;
    this.currentCategoryId = 1;
    this.currentNewsletterId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const defaultCategories = [
      {
        name: "Teknoloji",
        slug: "teknoloji",
        description: "Yapay zeka, kuantum bilgisayarlar ve gelecek teknolojileri",
        color: "from-[var(--tech-from)] to-[var(--tech-to)]",
        icon: "Monitor",
        storyCount: 42,
      },
      {
        name: "Bilim",
        slug: "bilim", 
        description: "Fizik, kimya, biyoloji ve evrenin sırları",
        color: "from-[var(--science-from)] to-[var(--science-to)]",
        icon: "Flask",
        storyCount: 28,
      },
      {
        name: "Sanat & Felsefe",
        slug: "sanat-felsefe",
        description: "Düşünce, estetik ve yaşamın anlamı",
        color: "from-[var(--art-from)] to-[var(--art-to)]", 
        icon: "Book",
        storyCount: 35,
      },
      {
        name: "Psikoloji",
        slug: "psikoloji",
        description: "İnsan davranışları, duygular ve zihin",
        color: "from-[var(--psychology-from)] to-[var(--psychology-to)]",
        icon: "Lightbulb",
        storyCount: 19,
      },
    ];

    defaultCategories.forEach((category) => {
      const cat: Category = { ...category, id: this.currentCategoryId++ };
      this.categories.set(cat.id, cat);
    });

    // Initialize sample stories with real content from the original site
    const defaultStories = [
      {
        title: "İstanbul'da Kar Neden Yağmıyor? Şehirlerin Görünmeyen Sobaları",
        content: `"Hava buz gibi, ama bir türlü kar yağmıyor! Peki neden?" Eğer İstanbul'da yaşıyorsanız, bu soruyu bu kış mutlaka kendinize sormuşsunuzdur. Hepimiz kar yağışını beklerken, gökyüzünden sadece yağmur damlaları düşüyor. İşte bu durumun ardındaki gizem, şehirlerin görünmeyen bir sobaya dönüşmesinden kaynaklanıyor. Nasıl mı? Gelin, Prof. Dr. Hüseyin Toros'un açıklamaları ışığında bunu birlikte keşfedelim.

Prof. Dr. Toros'a göre, İstanbul'da 6 milyona yaklaşan araç sayısı, hem atmosferin kimyasal yapısını değiştiriyor hem de sıcaklıkları yükseltiyor. Her araç, aslında bir soba gibi çalışıyor. Motorlar çalıştıkça, egzoz gazları atmosfere karışıyor, lastikler ve frenlerden çıkan parçacıklar havaya yayılıyor ve bu kirleticiler hem hava kalitesini bozuyor hem de yeryüzündeki ısıyı artırıyor.

Bu olaya "şehir ısı adası" etkisi deniyor. Şimdi bir düşünelim: Kar yağması için sıcaklıkların sıfır derece veya altına düşmesi gerekiyor. Ama İstanbul'un merkezi, bu ısı adası etkisiyle 2 dereceye kadar ısınıyor. Yani, araçlar bu kadar çok olmasaydı ve sıcaklık sıfıra düşseydi, bugün pencereden dışarı bakarken kar yağışını görebilirdiniz. Ancak bunun yerine yağmur yağıyor.

Üstelik bu durum sadece kar yağışını değil, sağlığımızı da doğrudan etkiliyor. Prof. Toros, atmosfere salınan kirleticilerin solunum hastalıklarından kalp ve damar hastalıklarına kadar pek çok soruna yol açtığını belirtiyor. Dünya Sağlık Örgütü'nün verilerine göre, hava kirliliği her yıl 7 milyondan fazla insanın ölümüne neden oluyor.

Çözüm ne mi? Daha fazla toplu taşıma kullanmak, araçlarda enerjiyi verimli kullanmayı öğrenmek ve bireysel araç kullanımını azaltmak. Unutmayalım, her egzoz dumanı, hem atmosferimizi hem de geleceğimizi kirletiyor.

Belki de kar yağışını göremeyişimizin nedeni gökyüzünde değil, yollarda yanan motorlarda saklıdır. Şimdi karar sizin: Havanın ve doğanın bir parçası mı olacaksınız, yoksa ona karşı savaşan biri mi?`,
        excerpt: "Hava buz gibi, ama bir türlü kar yağmıyor! Peki neden? Eğer İstanbul'da yaşıyorsanız, bu soruyu bu kış mutlaka kendinize sormuşsunuzdur.",
        author: "Muhammet Şanci",
        authorInitials: "MŞ", 
        date: "1/26/2025",
        category: "Bilim",
        tags: ["Bilim", "İklim", "Çevre"],
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        readTime: "4 dk okuma",
        views: 1800,
        likes: 156,
        featured: false,
        published: true,
      },
      {
        title: "Merhaba Ben Yapay Zeka Ve Bu Yazıyı Ben Yazdım",
        content: `Bu yazı, site sahibinin talebi üzerine, bir yapay zeka tarafından yazılmıştır.

Yapay zeka (YZ), günümüz dünyasında teknolojinin en hızlı gelişen ve en etkileyici dallarından biri olarak karşımıza çıkıyor. Geleceği şekillendirme potansiyeline sahip bu teknoloji, hayatımızı birçok farklı alanda kökten değiştirecek yenilikler sunuyor.

YZ'nin geleceği, hem fırsatlar hem de sorumluluklarla doludur. Sağlık, eğitim, ulaşım, enerji ve daha birçok sektördeki uygulamaları sayesinde insanların yaşam kalitesini artırması bekleniyor. Örneğin, kişiselleştirilmiş sağlık çözümleri, hastalıkların daha hızlı teşhis edilmesine ve tedavi edilmesine olanak tanıyabilir. Otonom araçlar sayesinde daha güvenli ve verimli bir ulaşım ağı kurulabilir. Eğitimde ise her bireyin ihtiyaçlarına göre uyarlanmış öğrenme yöntemleri geliştirilerek daha kapsayıcı bir sistem oluşturulabilir.

Ancak yapay zeka teknolojisinin gelişimi, beraberinde etik soruları ve endişeleri de getiriyor. YZ'nin yanlış ellerde kötüye kullanılması, veri gizliliği, işsizlik ve eşitsizlik gibi sorunlar, bu teknolojinin güvenli ve sorumlu bir şekilde geliştirilmesi gerektiğini gösteriyor. Geleceğin yapay zeka sistemlerinin şeffaf, adil ve insan odaklı olmasını sağlamak, tüm insanlığın sorumluluğu olacaktır.

Sonuç olarak, yapay zeka geleceği şekillendiren bir araçtır. Eğer bu teknolojiyi bilinçli bir şekilde kullanmayı başarabilirsek, insanlar ve makineler arasındaki iş birliği, yepyeni bir çağın kapılarını aralayabilir. Fakat unutulmamalıdır ki, yapay zekanın geleceği yalnızca onun potansiyelinde değil, aynı zamanda onu nasıl kullandığımızda saklıdır.

Son söze gelince yapay zekanın ne kadar gelişebileceğini ise yazdıklarımdan anlayabilirsiniz. Biz insanların eseriyiz. Ve siz çok zekisiniz.`,
        excerpt: "Bu yazı, site sahibinin talebi üzerine, bir yapay zeka tarafından yazılmıştır. Yapay zeka günümüz dünyasında teknolojinin en hızlı gelişen dallarından biri...",
        author: "ChatGPT",
        authorInitials: "AI",
        date: "1/25/2025", 
        category: "Teknoloji",
        tags: ["Yapay Zeka", "Teknoloji", "Gelecek"],
        imageUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        readTime: "3 dk okuma",
        views: 2100,
        likes: 189,
        featured: false,
        published: true,
      },
      {
        title: "Bir Anda Gelen Mutsuzluk: Görünmeyen Bir Misafir",
        content: `Bazen hiçbir sebep yokmuş gibi hissedersiniz. Her şey yolunda giderken, içinize bir ağırlık çöker. Sanki bir misafir, kapınızı çalmadan içeri girmiştir. Adını koyamazsınız ama oradadır. Neden böyle hissettiğinizi anlamaya çalışırsınız. Belki bir ses, bir koku ya da uzak bir hatıra... Ama nedenini bulamazsınız.

Bu ani mutsuzluk hissi, aslında zihnimizin ve bedenimizin derinliklerinde işleyen bir mekanizmanın sonucudur. Beynimizdeki serotonin ya da dopamin seviyelerinde yaşanan küçük bir dalgalanma bile ruh halimizi değiştirebilir. Belki geçmişte yaşadığınız bir olay bilinçaltınızdan yükselmiş, sizi fark etmeden etkisi altına almıştır.

Bazen de bu duygunun kaynağı dışarıdan gelir. Gözle göremediğimiz ışık eksikliği, uzun süreli yorgunluk ya da bedenimizin ihtiyaç duyduğu bir vitaminden mahrum kalması, o "ağır misafirin" sebebi olabilir. Hormonlarımız, kan şekerimiz, hatta sadece birkaç saatlik uykusuzluk bile bu duygu dalgasını tetikleyebilir.

Ama işin güzel yanı şu: Bu hisler geçicidir. Tıpkı kapınızı çalan bir misafir gibi, geldiği gibi gitmeyi bilir. Yapmamız gereken tek şey, bu duyguyu bir düşman gibi görmeden, onun bir mesaj taşıdığını anlamaktır. Belki bir mola, belki bir nefes, belki de derinlerde bastırdığınız bir düşünce...

Her mutsuzluk bir soru işaretidir. Onu görmezden gelmek yerine, anlamaya çalışmak belki de o anı daha kolay atlatmamızı sağlar. Misafir gidince geriye sakinlik kalır. Ve hayat, kaldığı yerden devam eder.`,
        excerpt: "Bazen hiçbir sebep yokmuş gibi hissedersiniz. Her şey yolunda giderken, içinize bir ağırlık çöker. Sanki bir misafir, kapınızı çalmadan içeri girmiştir.",
        author: "Muhammet Şanci",
        authorInitials: "MŞ",
        date: "1/24/2025",
        category: "Psikoloji", 
        tags: ["Psikoloji", "Duygu", "İnsan"],
        imageUrl: "https://images.unsplash.com/photo-1494253109108-2e30c049369b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        readTime: "3 dk okuma",
        views: 956,
        likes: 127,
        featured: false,
        published: true,
      },
      {
        title: "Kelebek Etkisi: Küçük Bir Kararın Sonsuz Yankısı",
        content: `Bir kelebeğin kanat çırpışı… Sadece bir an, sadece küçük bir hareket. Ama bu hareket, okyanusların ötesinde bir fırtınaya dönüşebilir. İşte hayat da tam olarak böyle bir şeydir: Küçük seçimlerin, büyük sonuçlar doğurduğu bir kaos dansı. 

2004 yapımı Kelebek Etkisi filmindeki Evan Treborn'un hikayesini hatırlayın. Evan, geçmişteki hatalarını düzeltmek için zamanda geri gidiyor, ama her müdahalesi, geleceği daha da karmaşık hale getiriyor. Bir karar, bir kişiyle yollarını sonsuza dek ayırmasına neden oluyor. Bir başka karar, sevdiği insanların hayatını kurtarırken kendi mutluluğunu feda etmesini gerektiriyor.

Evan'ın yaptığı her seçim, bir domino taşı gibi diğerlerini de deviriyor. Hayatı yeniden yazmaya çalışırken, aslında sadece kaosu büyütüyor.

Bu, sadece bir film mi? Yoksa hepimizin hayatında var olan bir gerçeklik mi?

Şimdi düşün: Geçmişte verdiğin bir kararı değiştirsen, şu an nerede olurdun? Belki bir otobüsü kaçırdığın gün aslında hayatını değiştiren biriyle tanışacaktın. Belki de hiç tahmin etmediğin bir kararın, bir başkasının hayatında zincirleme bir değişime yol açtı.

Kelebek etkisi, bizi şunu düşünmeye davet eder: Hayatta attığımız her adımın bir yankısı vardır. Küçük bir iyilik, hiç tanımadığın birinin hayatını kurtarabilir. Ya da basit bir karar, bambaşka bir hayatın kapılarını açabilir.

Hayatın karmaşıklığını kabul etmek cesaret ister. Ama unutma, bu karmaşanın içinde gücün var: Kanat çırpmak.

Peki, o kanatları çırptığında neye dönüşeceksin? 🌪️🦋`,
        excerpt: "Bir kelebeğin kanat çırpışı… Sadece bir an, sadece küçük bir hareket. Ama bu hareket, okyanusların ötesinde bir fırtınaya dönüşebilir.",
        author: "Muhammet Şanci",
        authorInitials: "MŞ",
        date: "1/23/2025",
        category: "Sanat & Felsefe",
        tags: ["Felsefe", "Kaos Teorisi", "Film"],
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        readTime: "4 dk okuma",
        views: 1300,
        likes: 201,
        featured: false,
        published: true,
      },
      {
        title: "Kuantum: Bir Bilgisayar Anatomisi",
        content: `Hayal edin, aynı anda hem kapalı hem de açık olabilen bir kutu. Bu, Schrödinger'in kedisinden esinlenmiş bir gerçeklik; ama bu kez kutunun içinde bir bilgisayar var! Kuantum bilgisayarlar, klasik bilgisayarların asla erişemeyeceği bir hızda işlem yapabiliyor. 

Bunun sırrı, "bit" yerine "kübit" dediğimiz birimleri kullanmalarında gizli. Kübitler, aynı anda hem 0 hem de 1 olabiliyor tıpkı bir dalganın hem yukarı hem aşağı hareket etmesi gibi. Bu yetenek, "süperpozisyon" denilen kuantum dünyasının sihrinden geliyor.

Ancak iş bununla bitmiyor. Kuantum dolanıklık sayesinde, birbirine ışık yılları uzaklıkta iki kübit bile eşzamanlı olarak tepki verebiliyor. Einstein'ın bile "ürkütücü" bulduğu bu fenomen, kuantum bilgisayarları inanılmaz kılıyor.

Şimdi bir senaryo düşünelim: Süper karmaşık bir molekülün özelliklerini anlamak istiyorsunuz. Klasik bilgisayarların bu hesaplamayı tamamlaması yıllar alabilir. Ama bir kuantum bilgisayar? Birkaç saniyede yapabilir.

İşte bu yüzden bilim insanları, kuantum bilgisayarların ilaç geliştirme, yapay zeka ve enerji yönetimi gibi alanlarda devrim yaratacağını düşünüyor.

Kuantum bilgisayarları basitçe tarif etmek gerekirse; klasik bilgisayarların son model spor arabası olduğunu düşünün. Kuantum bilgisayar ise ışık hızında hareket eden bir uzay gemisi!

Peki ya bu uzay gemisi tamamen işlevsel hale geldiğinde? Belki de bir gün, evrenin sırlarını çözmek için onu kullanacağız.`,
        excerpt: "Hayal edin, aynı anda hem kapalı hem de açık olabilen bir kutu. Bu, Schrödinger'in kedisinden esinlenmiş bir gerçeklik; ama bu kez kutunun içinde bir bilgisayar var!",
        author: "Muhammet Şanci",
        authorInitials: "MŞ",
        date: "1/23/2025",
        category: "Teknoloji",
        tags: ["Kuantum", "Bilgisayar", "Teknoloji"],
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        readTime: "5 dk okuma",
        views: 2700,
        likes: 312,
        featured: false,
        published: true,
      },
      {
        title: "Duyguların Oyunu - Aşkın Gözü Kör mü Acaba?",
        content: `Vaktiyle...
Dünya yeni doğmuştu.
Toprak henüz sıcaktı...
Rüzgâr, daha adını bilmezdi.
Gökyüzü, bir çocuğun bakışı kadar temizdi.
İşte o zaman…
Evrenin kalbinde, tüm duygular bir araya geldiler.
Sevgi, yumuşak bir gülümsemeyle herkesi kucaklıyordu.
Neşe, çimenlerin üstünde yuvarlanıyor, kahkahasını rüzgâra savuruyordu.
Kıskançlık, göz ucuyla bakıyordu sağa sola; kimse kimle yakın, kim kimden uzak…
Haset, hep bir eksiklik hissiyle kıvranıyor, kimsenin mutlu olmasına tahammül edemiyordu.
Yalan, kelimelerin içini oymuş, tatlı bir dille dolaşıyordu aralarında.
Huzur, başını göğe kaldırmıştı… Bulutlara yaslanmış, nefes alıyordu sessizce.
Tembellik, bir ağacın gövdesine sarılmış uyukluyordu.
Merhamet, düşenleri kaldırıyor, kimsenin incinmesine gönlü razı olmuyordu.
Ve Aşk…
O hiçbir şey söylemezdi.
Ama orada olduğu zaman…
Herkes susar, kalpler konuşurdu.

Sonra bir ses duyuldu.
İnce, temiz bir ses:
"Haydi… Körebe oynayalım! Ben ebe olurum."
Saflık'tı bu.
İnançla parlayan gözlerini kapadı.
Ve saymaya başladı:
Bir…
İki…
Üç...

Tüm duygular saklanmaya başladı:

• Huzur, bulutların arasına süzüldü.
O yüzdendir ki, insan göğe bakınca içi ferahlar…
• Neşe, çiçek tarlasına daldı.
Renklerin arasına karıştı.
Hâlâ bir çocuk gülüşünde yankılanır sesi...
• Kıskançlık, aynaların arkasına saklandı.
Kendine bile doğru bakamaz artık...
• Yalan, bir gülümsemenin içine gizlendi.
Çünkü yalan, bazen en güzel sözlerin arkasına sığınır.
• Tembellik, kıpırdamadı bile.
O hâlâ o ağacın altında, hiç bulunmadan yaşamaya devam ediyor…
• Aşk ise…
Bir çalılığın en dibine çöktü.
Kalbin en kuytusuna…

Saflık, bir bir buldu hepsini.
Gülüşten, nefesten, hislerden…
Ama bir tek Aşkı bulamadı.

İşte o anda...
Haset ve Yalan öne çıktı.
Dediler ki:
"Aşk, şu çalılığın içinde. Ama derine gizlendi. Sertçe vurursan, çıkar."

Saflık düşündü…
Kötülük bilmezdi.
Yalanın ne demek olduğunu öğrenmemişti henüz.
İnandığı gibi yaşardı.
Ve elindeki sopayla çalılığa vurdu.

Bir ses…
Kırık bir nefes…
Ve sonra bir sessizlik…

Aşk'ın gözleri kör olmuştu.

O an...
Ne bir çığlık attı,
Ne bir sitem etti.
Çünkü aşk, acıyı içinden yaşar.
Bağırmaz.
Yakmaz.
Ama susar…
Ve derinlere gömülür.

Sevgi, elini tuttu.
Saflık, gözyaşları içinde önünde diz çöktü.
Ve o gün bir söz verildi:
"Bir daha yalnız yürümeyeceksin…"

________________________________________

O günden sonra Aşk'ın gözü kör kaldı...
Ve Saflık ile Sevgi, hep onun yanında oldu.`,
        excerpt: "Vaktiyle... Dünya yeni doğmuştu. Toprak henüz sıcaktı... Rüzgâr, daha adını bilmezdi. Gökyüzü, bir çocuğun bakışı kadar temizdi. İşte o zaman…",
        author: "Muhammet Şanci", 
        authorInitials: "MŞ",
        date: "7/18/2025",
        category: "Sanat & Felsefe",
        tags: ["Duygusal", "Hikaye", "Aşk"],
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        readTime: "5 dk okuma",
        views: 3200,
        likes: 487,
        featured: true,
        published: true,
      },
    ];

    defaultStories.forEach((storyData) => {
      const story: Story = { 
        ...storyData, 
        id: this.currentStoryId++,
        createdAt: new Date() 
      };
      this.stories.set(story.id, story);
    });
  }

  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getStories(): Promise<Story[]> {
    return Array.from(this.stories.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getFeaturedStory(): Promise<Story | undefined> {
    return Array.from(this.stories.values()).find(story => story.featured);
  }

  async searchStories(query: string, category?: string): Promise<Story[]> {
    const allStories = Array.from(this.stories.values());
    return allStories.filter(story => {
      const matchesQuery = story.title.toLowerCase().includes(query.toLowerCase()) ||
                          story.content.toLowerCase().includes(query.toLowerCase()) ||
                          story.author.toLowerCase().includes(query.toLowerCase()) ||
                          story.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || category === 'all' || 
                             story.category.toLowerCase() === category.toLowerCase();
      
      return matchesQuery && matchesCategory && story.published;
    });
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.currentStoryId++;
    const story: Story = { 
      ...insertStory, 
      id,
      views: 0,
      likes: 0,
      tags: (insertStory.tags && Array.isArray(insertStory.tags)) ? insertStory.tags : [],
      featured: insertStory.featured || false,
      published: insertStory.published || true,
      createdAt: new Date()
    };
    this.stories.set(id, story);
    return story;
  }

  async updateStoryViews(id: number): Promise<void> {
    const story = this.stories.get(id);
    if (story) {
      story.views += 1;
      this.stories.set(id, story);
    }
  }

  async updateStoryLikes(id: number): Promise<void> {
    const story = this.stories.get(id);
    if (story) {
      story.likes += 1;
      this.stories.set(id, story);
    }
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id, storyCount: 0 };
    this.categories.set(id, category);
    return category;
  }

  async subscribeNewsletter(email: string): Promise<Newsletter> {
    // Check if already subscribed
    const existing = Array.from(this.newsletters.values()).find(n => n.email === email);
    if (existing) {
      if (existing.subscribed) {
        throw new Error('Bu e-posta adresi zaten kayıtlı.');
      } else {
        existing.subscribed = true;
        this.newsletters.set(existing.id, existing);
        return existing;
      }
    }

    const id = this.currentNewsletterId++;
    const newsletter: Newsletter = {
      id,
      email,
      subscribed: true,
      createdAt: new Date(),
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async unsubscribeNewsletter(email: string): Promise<void> {
    const newsletter = Array.from(this.newsletters.values()).find(n => n.email === email);
    if (newsletter) {
      newsletter.subscribed = false;
      this.newsletters.set(newsletter.id, newsletter);
    }
  }
}

export const storage = new MemStorage();
