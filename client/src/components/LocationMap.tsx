import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCurrentPosition, reverseGeocode, initialLocation } from "@/lib/geolocation";

const LocationMap: React.FC = () => {
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        
        // Get the city and country from coordinates
        const locationDetails = await reverseGeocode(latitude, longitude);
        
        setLocation({
          coordinates: { latitude, longitude },
          city: locationDetails.city,
          country: locationDetails.country,
          error: null,
          loading: false
        });
      } catch (error) {
        setLocation({
          ...location,
          error: (error as Error).message,
          loading: false
        });
        console.error("Error getting location:", error);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="map-container relative h-64 md:h-80 rounded-xl overflow-hidden mb-10">
      <div className="map-overlay absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="text-center text-white p-6 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {location.loading ? (
            <h2 className="text-2xl font-bold mb-3">Detecting your location...</h2>
          ) : location.error ? (
            <div>
              <h2 className="text-2xl font-bold mb-3">Location unavailable</h2>
              <p>{location.error}</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-3">
                Your location: <span className="text-primary-light">{location.city}, {location.country}</span>
              </h2>
              <p className="mb-4">5 active campaigns in your region</p>
              <motion.button 
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Regional Campaigns
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LocationMap;
