
import { users, type User, type InsertUser } from "@shared/schema";

export interface Campaign {
  id: string;
  title: string;
  summary: string;
  type: string;
  status: string;
  sponsor: string;
  endDate: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  upvotes: number;
  downvotes: number;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: Omit<Campaign, "id" | "status" | "upvotes" | "downvotes">): Promise<Campaign>;
  addVote(campaignId: string, vote: "up" | "down", reason?: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<string, Campaign>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async createCampaign(campaignData: Omit<Campaign, "id" | "status" | "upvotes" | "downvotes">): Promise<Campaign> {
    const id = Date.now().toString();
    const campaign: Campaign = {
      ...campaignData,
      id,
      status: "pending",
      upvotes: 0,
      downvotes: 0
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async addVote(campaignId: string, vote: "up" | "down", reason?: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) throw new Error("Campaign not found");
    
    if (vote === "up") campaign.upvotes++;
    else campaign.downvotes++;
    
    if (campaign.upvotes - campaign.downvotes >= 3) {
      campaign.status = "live";
    }
    
    this.campaigns.set(campaignId, campaign);
  }
}

export const storage = new MemStorage();
