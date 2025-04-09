import React from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [location] = useLocation();
  const { user } = useAuth();

  const isActiveRoute = (route: string) => {
    return location === route;
  };

  return (
    <aside className="flex flex-col h-full bg-white border-r border-neutral-200">
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <Link href="/">
            <div 
              className={`flex items-center px-2 py-2 text-sm rounded-lg cursor-pointer ${
                isActiveRoute('/') 
                  ? "text-neutral-900 bg-neutral-100 font-medium" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              onClick={onClose}
            >
              <i className="fas fa-home w-6"></i>
              Home
            </div>
          </Link>

          <Link href="/dashboard">
            <div 
              className={`flex items-center px-2 py-2 text-sm rounded-lg cursor-pointer ${
                isActiveRoute('/dashboard') 
                  ? "text-neutral-900 bg-neutral-100 font-medium" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              onClick={onClose}
            >
              <i className="fas fa-chart-line w-6"></i>
              Dashboard
            </div>
          </Link>

          <Link href="/create-campaign">
            <div 
              className={`flex items-center px-2 py-2 text-sm rounded-lg cursor-pointer ${
                isActiveRoute('/create-campaign') 
                  ? "text-neutral-900 bg-neutral-100 font-medium" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              onClick={onClose}
            >
              <i className="fas fa-plus w-6"></i>
              Create Campaign
            </div>
          </Link>

          <Link href="/integrity-vote">
            <div 
              className={`flex items-center px-2 py-2 text-sm rounded-lg cursor-pointer ${
                isActiveRoute('/integrity-vote') 
                  ? "text-neutral-900 bg-neutral-100 font-medium" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              onClick={onClose}
            >
              <i className="fas fa-shield-alt w-6"></i>
              Integrity Vote
            </div>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
            <i className="fas fa-user text-neutral-500"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-800">{user?.email || 'Guest'}</p>
            <p className="text-xs text-neutral-500">User</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;