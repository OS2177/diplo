import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

// Export Campaign interface to match our JSON structure
export interface Campaign {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  image?: string;
  type?: string; // "Global", "Regional", "Local"
  scope?: "Global" | "Regional";
  region?: string;
  status?: string; // "live" or "pending"
  countdown?: string;
  daysLeft?: number;
  votes?: number;
  sponsor?: {
    name: string;
    colorClass: string;
  };
  lat?: number;
  long?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

interface CampaignTileProps {
  campaign: Campaign;
}

const CampaignTile: React.FC<CampaignTileProps> = ({ campaign }) => {
  // Default image for campaigns if none is provided
  const defaultImage = "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=2089&auto=format&fit=crop";
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="h-40 bg-primary-light/10 relative">
        <div className="w-full h-full bg-blue-100"></div>
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-xs font-medium text-neutral-800">
          {campaign.countdown}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <i className={`fas ${campaign.type === "Global" || campaign.scope === "Global" ? "fa-globe-americas" : "fa-map-marker-alt"} mr-2`}></i>
          <span>{campaign.type || campaign.scope}</span>
        </div>
        <h3 className="font-heading font-bold text-lg mb-2">{campaign.title}</h3>
        <p className="text-neutral-600 text-sm mb-4">{campaign.summary}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-neutral-500">
              {campaign.status === "live" ? 
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Live</span> : 
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
              }
            </span>
          </div>
          <Link href={`/campaign/${campaign.id}`}>
            <div className="text-primary-dark hover:text-primary-light font-medium text-sm cursor-pointer">
              Vote now →
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignTile;
