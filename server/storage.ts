import { Story, Category, Newsletter } from "@/shared/schema";

export interface IStorage {
  // Story operations
  getStory(id: number): Promise<Story | undefined>;
  getStories(): Promise<Story[]>;
  getFeaturedStory(): Promise<Story | undefined>;
  searchStories(query: string, category?: string): Promise<Story[]>;
  getStoriesByCategory(category: string): Promise<Story[]>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  
  // Newsletter operations
  getNewsletters(): Promise<Newsletter[]>;
  createNewsletter(email: string): Promise<Newsletter>;
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
        color: "from-blue-600 to-blue-800",
        icon: "Monitor",
        storyCount: 42,
      },
      {
        name: "Bilim",
        slug: "bilim", 
        description: "Fizik, kimya, biyoloji ve evrenin sırları",
        color: "from-green-500 to-green-700",
        icon: "FlaskConical",
        storyCount: 28,
      },
      {
        name: "Sanat & Felsefe",
        slug: "sanat-felsefe",
        description: "Düşünce, estetik ve yaşamın anlamı",
        color: "from-purple-500 to-purple-700", 
        icon: "Book",
        storyCount: 35,
      },
      {
        name: "Psikoloji",
        slug: "psikoloji",
        description: "İnsan davranışları, duygular ve zihin",
        color: "from-orange-500 to-red-600",
        icon: "Lightbulb",
        storyCount: 19,
      },
    ];

    defaultCategories.forEach((category) => {
      const cat: Category = { ...category, id: this.currentCategoryId++ };
      this.categories.set(cat.id, cat);
    });

    // No stories to initialize - Firebase handles all story management now
    // Express serves as backup only, no default stories needed
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
    const stories = Array.from(this.stories.values());
    return stories.filter(story => {
      const matchesQuery = story.title.toLowerCase().includes(query.toLowerCase()) ||
                          story.content.toLowerCase().includes(query.toLowerCase()) ||
                          story.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || story.category.toLowerCase() === category.toLowerCase();
      
      return matchesQuery && matchesCategory;
    });
  }

  async getStoriesByCategory(category: string): Promise<Story[]> {
    const stories = Array.from(this.stories.values());
    return stories.filter(story => story.category.toLowerCase() === category.toLowerCase())
                 .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getNewsletters(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values());
  }

  async createNewsletter(email: string): Promise<Newsletter> {
    const newsletter: Newsletter = {
      id: this.currentNewsletterId++,
      email,
      subscribedAt: new Date(),
    };
    this.newsletters.set(newsletter.id, newsletter);
    return newsletter;
  }
}

export const storage = new MemStorage();