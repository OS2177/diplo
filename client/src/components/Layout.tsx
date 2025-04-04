import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import MobileNavigation from "./MobileNavigation";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMobileMenu}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <Sidebar mobile onClose={toggleMobileMenu} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <MobileHeader onMenuClick={toggleMobileMenu} />

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
};

export default Layout;
