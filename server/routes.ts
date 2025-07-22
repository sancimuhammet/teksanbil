import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsletterSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stories endpoints
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.get("/api/stories/featured", async (req, res) => {
    try {
      const story = await storage.getFeaturedStory();
      if (!story) {
        return res.status(404).json({ message: "No featured story found" });
      }
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured story" });
    }
  });

  app.get("/api/stories/search", async (req, res) => {
    try {
      const { q: query, category } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      if (query.length < 3) {
        return res.status(400).json({ message: "Query must be at least 3 characters" });
      }

      const stories = await storage.searchStories(
        query, 
        category && typeof category === 'string' ? category : undefined
      );
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to search stories" });
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const story = await storage.getStory(id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }

      // Increment view count
      await storage.updateStoryViews(id);
      
      res.json({ ...story, views: story.views + 1 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch story" });
    }
  });

  app.post("/api/stories/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const story = await storage.getStory(id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }

      await storage.updateStoryLikes(id);
      const updatedStory = await storage.getStory(id);
      
      res.json({ likes: updatedStory!.likes });
    } catch (error) {
      res.status(500).json({ message: "Failed to like story" });
    }
  });

  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Newsletter endpoints
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(validatedData.email);
      
      res.status(201).json({ 
        message: "Successfully subscribed to newsletter",
        email: subscription.email 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid email format",
          errors: error.errors 
        });
      }
      
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email is required" });
      }

      await storage.unsubscribeNewsletter(email);
      res.json({ message: "Successfully unsubscribed from newsletter" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unsubscribe from newsletter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
