
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const campaignSchema = z.object({
  title: z.string(),
  summary: z.string(),
  type: z.string(),
  sponsor: z.string(),
  endDate: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/campaigns", async (_req: Request, res: Response) => {
    const campaigns = await storage.getAllCampaigns();
    res.json(campaigns);
  });

  app.post("/api/campaigns", async (req: Request, res: Response) => {
    try {
      const campaign = campaignSchema.parse(req.body);
      const result = await storage.createCampaign(campaign);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid campaign data" });
    }
  });

  app.post("/api/campaigns/:id/vote", async (req: Request, res: Response) => {
    const { id: campaign_id } = req.params;
    const { user_id, choice, latitude, longitude, impact } = req.body;

    if (!user_id || !choice || !campaign_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const { data, error } = await supabase
        .from('votes')
        .insert([{ 
          campaign_id, 
          user_id, 
          choice, 
          impact, 
          latitude, 
          longitude,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      res.status(200).json({ success: true, vote: data[0] });
    } catch (error) {
      console.error('Vote recording error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/campaigns/:id/promote", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await storage.promoteCampaign(id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to promote campaign" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
