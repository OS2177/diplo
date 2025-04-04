
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
    const { id } = req.params;
    const { vote, reason } = req.body;
    try {
      await storage.addVote(id, vote, reason);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid vote" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
