import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Campaign } from "@/lib/mockData";

interface CampaignTileProps {
  campaign: Campaign;
}

const CampaignTile: React.FC<CampaignTileProps> = ({ campaign }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="h-40 bg-primary-light/10 relative">
        <img 
          src={campaign.image} 
          className="w-full h-full object-cover" 
          alt={campaign.title} 
        />
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-xs font-medium text-neutral-800">
          {campaign.daysLeft} days left
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <i className={`fas ${campaign.scope === "Global" ? "fa-globe-americas" : "fa-map-marker-alt"} mr-2`}></i>
          <span>{campaign.scope === "Global" ? "Global" : `Regional: ${campaign.region}`}</span>
          <span className="mx-2">•</span>
          <span>{campaign.votes.toLocaleString()} votes</span>
        </div>
        <h3 className="font-heading font-bold text-lg mb-2">{campaign.title}</h3>
        <p className="text-neutral-600 text-sm mb-4">{campaign.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className={`inline-block w-2 h-2 rounded-full ${campaign.sponsor.colorClass}`}></span>
            <span className="text-xs text-neutral-500">{campaign.sponsor.name}</span>
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
