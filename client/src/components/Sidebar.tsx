import React from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { userCampaigns, userProfile } from "@/lib/mockData";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onClose }) => {
  const [location] = useLocation();

  const isActiveRoute = (path: string) => {
    return location === path;
  };

  const baseClasses = mobile
    ? "flex flex-col w-full h-full bg-white"
    : "hidden md:flex flex-col w-64 bg-white border-r border-neutral-200";

  return (
    <aside className={baseClasses}>
      <div className="p-5 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-light rounded-lg p-2 text-white">
            <i className="fas fa-globe-americas text-xl"></i>
          </div>
          <h1 className="font-heading font-bold text-2xl text-neutral-800">Diplo</h1>
        </div>
        <p className="text-sm text-neutral-500 mt-1">Global diplomacy platform</p>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <Link href="/">
            <div 
              className={`flex items-center px-2 py-3 rounded-lg cursor-pointer ${
                isActiveRoute("/") 
                  ? "text-primary-dark bg-primary-light/10" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              onClick={onClose}
            >
              <i className="fas fa-home w-6"></i>
              <span className={`ml-3 ${isActiveRoute("/") ? "font-medium" : ""}`}>Home</span>
            </div>
          </Link>
          
          <Link href="/integrity-vote">
            <div 
              className={`flex items-center px-2 py-3 rounded-lg cursor-pointer ${
                isActiveRoute("/integrity-vote") 
                  ? "text-primary-dark bg-primary-light/10" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              onClick={onClose}
            >
              <i className="fas fa-shield-check w-6"></i>
              <span className={`ml-3 ${isActiveRoute("/integrity-vote") ? "font-medium" : ""}`}>Integrity</span>
            </div>
          </Link>

          <Link href="/dashboard">
            <div 
              className={`flex items-center px-2 py-3 rounded-lg cursor-pointer ${
                isActiveRoute("/dashboard") 
                  ? "text-primary-dark bg-primary-light/10" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              onClick={onClose}
            >
              <i className="fas fa-chart-line w-6"></i>
              <span className={`ml-3 ${isActiveRoute("/dashboard") ? "font-medium" : ""}`}>Dashboard</span>
            </div>
          </Link>

          <Link href="/results">
            <div 
              className={`flex items-center px-2 py-3 rounded-lg cursor-pointer ${
                isActiveRoute("/results") 
                  ? "text-primary-dark bg-primary-light/10" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              onClick={onClose}
            >
              <i className="fas fa-archive w-6"></i>
              <span className={`ml-3 ${isActiveRoute("/results") ? "font-medium" : ""}`}>Archive</span>
            </div>
          </Link>
          
          <Link href="/create-campaign">
            <div 
              className={`flex items-center px-2 py-3 rounded-lg cursor-pointer ${
                isActiveRoute("/create-campaign") 
                  ? "text-primary-dark bg-primary-light/10" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              onClick={onClose}
            >
              <i className="fas fa-plus-circle w-6"></i>
              <span className={`ml-3 ${isActiveRoute("/create-campaign") ? "font-medium" : ""}`}>Create Campaign</span>
            </div>
          </Link>
        </div>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            My Campaigns
          </h3>
          <div className="mt-2 space-y-1">
            {userCampaigns.map(campaign => (
              <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
                <div 
                  className={`flex items-center px-2 py-2 text-sm rounded-lg cursor-pointer ${
                    isActiveRoute(`/campaign/${campaign.id}`) 
                      ? "text-primary-dark bg-primary-light/10" 
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                  onClick={onClose}
                >
                  <span className={`w-2 h-2 rounded-full ${campaign.colorClass} mr-3`}></span>
                  {campaign.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center">
          <img src={userProfile.avatar} className="h-10 w-10 rounded-full" alt="User avatar" />
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-800">{userProfile.name}</p>
            <p className="text-xs text-neutral-500">{userProfile.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
