import React from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

const MobileNavigation: React.FC = () => {
  const [location] = useLocation();

  const isActiveRoute = (path: string) => {
    return location === path;
  };

  const getLinkClass = (path: string) => {
    return `flex flex-col items-center ${
      isActiveRoute(path) ? "text-primary" : "text-neutral-500"
    }`;
  };

  return (
    <nav className="md:hidden bg-white border-t border-neutral-200 px-4 py-3">
      <div className="flex justify-around">
        <div className={getLinkClass("/")} onClick={() => window.location.href="/"}>
          <motion.i 
            className="fas fa-home text-lg"
            whileTap={{ scale: 0.9 }}
          ></motion.i>
          <span className="text-xs mt-1">Home</span>
        </div>
        
        <div className={getLinkClass("/campaigns")} onClick={() => window.location.href="/campaigns"}>
          <motion.i 
            className="fas fa-list text-lg"
            whileTap={{ scale: 0.9 }}
          ></motion.i>
          <span className="text-xs mt-1">Campaigns</span>
        </div>
        
        <div className={getLinkClass("/create-campaign")} onClick={() => window.location.href="/create-campaign"}>
          <motion.i 
            className="fas fa-plus-circle text-lg"
            whileTap={{ scale: 0.9 }}
          ></motion.i>
          <span className="text-xs mt-1">Create</span>
        </div>
        
        <div className={getLinkClass("/results")} onClick={() => window.location.href="/results"}>
          <motion.i 
            className="fas fa-chart-pie text-lg"
            whileTap={{ scale: 0.9 }}
          ></motion.i>
          <span className="text-xs mt-1">Results</span>
        </div>
        
        <div className={getLinkClass("/dashboard")} onClick={() => window.location.href="/dashboard"}>
          <motion.i 
            className="fas fa-user text-lg"
            whileTap={{ scale: 0.9 }}
          ></motion.i>
          <span className="text-xs mt-1">Profile</span>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavigation;
