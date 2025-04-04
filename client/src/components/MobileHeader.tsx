import React from "react";
import { motion } from "framer-motion";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="md:hidden bg-white border-b border-neutral-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-light rounded-lg p-1.5 text-white">
            <i className="fas fa-globe-americas text-lg"></i>
          </div>
          <h1 className="font-heading font-bold text-xl text-neutral-800">Diplo</h1>
        </div>
        <motion.button 
          className="text-neutral-500 focus:outline-none"
          onClick={onMenuClick}
          whileTap={{ scale: 0.9 }}
        >
          <i className="fas fa-bars text-xl"></i>
        </motion.button>
      </div>
    </header>
  );
};

export default MobileHeader;
