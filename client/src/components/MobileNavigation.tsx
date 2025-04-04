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
        <Link href="/" className={getLinkClass("/")}>
          <motion.i 
            className="fas fa-home text-lg"
            whileTap={{ scale: 0.9 }}
          ></motion.i>
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link href="/campaigns" className={getLinkClass("/campaigns")}>
          <motion.i 
            className="fas fa-list text-lg"
            whileTap={{ scale: 0.9 }}
          ></motion.i>
          <span className="text-xs mt-1">Campaigns</span>
        </Link>
        
        <Link href="/create-campaign" className={getLinkClass("/create-campaign")}>
          <motion.i 
            className="fas fa-plus-circle text-lg"
            whileTap={{ scale: 0.9 }}
          ></motion.i>
          <span className="text-xs mt-1">Create</span>
        </Link>
        
        <Link href="/results" className={getLinkClass("/results")}>
          <motion.i 
            className="fas fa-chart-pie text-lg"
            whileTap={{ scale: 0.9 }}
          ></motion.i>
          <span className="text-xs mt-1">Results</span>
        </Link>
        
        <Link href="/dashboard" className={getLinkClass("/dashboard")}>
          <motion.i 
            className="fas fa-user text-lg"
            whileTap={{ scale: 0.9 }}
          ></motion.i>
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;
