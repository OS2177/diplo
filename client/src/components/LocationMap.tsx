import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCurrentPosition, reverseGeocode, initialLocation } from "@/lib/geolocation";

interface LocationMapProps {
  coordinates?: { latitude: number; longitude: number } | null;
  nearbyCampaignsCount?: number;
}

const LocationMap: React.FC<LocationMapProps> = ({ coordinates, nearbyCampaignsCount = 0 }) => {
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    if (coordinates) {
      // If coordinates are passed as props, use them
      const fetchLocationDetails = async () => {
        try {
          const locationDetails = await reverseGeocode(coordinates.latitude, coordinates.longitude);
          
          setLocation({
            coordinates,
            city: locationDetails.city,
            country: locationDetails.country,
            error: null,
            loading: false
          });
        } catch (error) {
          setLocation({
            coordinates,
            city: "Unknown",
            country: "Unknown",
            error: null,
            loading: false
          });
        }
      };
      
      fetchLocationDetails();
    } else {
      // Otherwise, get the location
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
    }
  }, [coordinates]);

  return (
    <div className="map-container relative h-64 md:h-80 rounded-xl overflow-hidden mb-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500">
      {/* Map background with a subtle pattern */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmZmZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMCA4NEwyOCAxMDBMNTYgODRMNTYgNTBMMjggMzQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==')]"></div>
      
      {/* Optional: Add a pulsing location indicator if we have coordinates */}
      {location.coordinates && !location.loading && !location.error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center z-10">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <div className="absolute top-0 left-0 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
        </div>
      )}
      
      <div className="map-overlay absolute inset-0 flex items-center justify-center bg-gradient-to-t from-gray-900/70 to-transparent">
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
              <p className="mb-4">
                {nearbyCampaignsCount > 0 
                  ? `${nearbyCampaignsCount} active campaign${nearbyCampaignsCount !== 1 ? 's' : ''} in your region`
                  : 'No active campaigns in your specific region'}
              </p>
              <motion.button 
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {nearbyCampaignsCount > 0 ? 'View Regional Campaigns' : 'Explore Global Campaigns'}
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LocationMap;
