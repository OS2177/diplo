import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import LocationMap from "@/components/LocationMap";
import CampaignTile from "@/components/CampaignTile";
import VoteResultsGraph from "@/components/VoteResultsGraph";
import { activeCampaigns, recentResults } from "@/lib/mockData";

const Home: React.FC = () => {
  return (
    <div className="px-4 py-6 md:p-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
          Global Diplomacy at Your Fingertips
        </h1>
        <p className="mt-3 text-lg text-neutral-600 max-w-3xl">
          Diplo connects citizens, diplomats, and policymakers worldwide through location-aware voting on critical global issues.
        </p>
      </motion.div>

      <LocationMap />

      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-heading font-bold">Active Campaigns</h2>
          <Link href="/campaigns">
            <a className="text-primary-dark hover:text-primary font-medium flex items-center">
              View all <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCampaigns.map(campaign => (
            <CampaignTile key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-heading font-bold">Recently Completed</h2>
          <Link href="/results">
            <a className="text-primary-dark hover:text-primary font-medium flex items-center">
              View all results <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentResults.map(result => (
            <VoteResultsGraph key={result.id} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
