import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import LocationMap from "@/components/LocationMap";
import CampaignTile, { Campaign } from "@/components/CampaignTile";
import VoteResultsGraph from "@/components/VoteResultsGraph";
import { recentResults } from "@/lib/mockData";
import { initialLocation, getCurrentPosition, reverseGeocode } from "@/lib/geolocation";

// Sample campaign data
const campaignData: Campaign[] = [
  {
    id: "1",
    title: "War or No War",
    summary: "A collective vote on the future of the Ukraine-Russia conflict.",
    type: "Regional",
    status: "live",
    countdown: "2 days",
    lat: 50.4501,
    long: 30.5234,
    radius: 1500
  },
  {
    id: "2",
    title: "Universal Basic Income",
    summary: "Should a global UBI be adopted as an economic right?",
    type: "Global",
    status: "pending",
    countdown: "5 days",
    lat: 0,
    long: 0,
    radius: 20000
  },
  {
    id: "3",
    title: "Ban Surveillance Drones",
    summary: "A public vote on banning drone surveillance in civilian spaces.",
    type: "Local",
    status: "live",
    countdown: "3 days",
    lat: 48.8566,
    long: 2.3522,
    radius: 100
  }
];

const Home: React.FC = () => {
  // State for user location
  const [location, setLocation] = useState(initialLocation);
  const [nearbyCampaigns, setNearbyCampaigns] = useState<Campaign[]>([]);
  const [activeCampaigns] = useState<Campaign[]>(campaignData);
  
  // Use a ref to track if we've already set the initial campaigns
  const initialCampaignsSet = useRef(false);
  
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };
  
  // Check if a campaign is within range based on user's location
  const isCampaignInRange = (campaign: Campaign): boolean => {
    if (!location.coordinates || campaign.type === 'Global') return true;
    
    const campaignLat = campaign.latitude || campaign.lat;
    const campaignLong = campaign.longitude || campaign.long;
    
    if (!campaignLat || !campaignLong) return true; // If no location data, always show
    
    const distance = calculateDistance(
      location.coordinates.latitude, 
      location.coordinates.longitude,
      campaignLat,
      campaignLong
    );
    
    // Convert radius from km to meters
    const radius = campaign.radius || 1000; // Default to 1000km if not specified
    return distance * 1000 <= radius;
  };
  
  // Get user's location
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const position = await getCurrentPosition();
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        // Attempt to reverse geocode
        const locationInfo = await reverseGeocode(coords.latitude, coords.longitude);
        
        setLocation(prevLocation => ({
          ...prevLocation,
          coordinates: coords,
          city: locationInfo.city,
          country: locationInfo.country,
          loading: false
        }));
      } catch (error) {
        setLocation(prevLocation => ({
          ...prevLocation,
          error: 'Unable to retrieve your location',
          loading: false
        }));
      }
    };
    
    getUserLocation();
  }, []);
  
  // Set initial campaigns (only live ones)
  useEffect(() => {
    if (!initialCampaignsSet.current) {
      setNearbyCampaigns(activeCampaigns.filter(campaign => campaign.status === 'live'));
      initialCampaignsSet.current = true;
    }
  }, [activeCampaigns]);
  
  // Update nearby campaigns when location changes
  useEffect(() => {
    if (location.coordinates) {
      const nearby = activeCampaigns.filter(campaign => isCampaignInRange(campaign));
      setNearbyCampaigns(nearby);
    }
  }, [location.coordinates, activeCampaigns]);
  
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

      <div className="mb-8">
        {location.loading ? (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-blue-700">
              <i className="fas fa-location-arrow mr-2"></i>
              Detecting your location...
            </p>
          </div>
        ) : location.error ? (
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-red-700">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {location.error} - Some campaigns may not be available to you
            </p>
          </div>
        ) : location.coordinates ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="text-green-700">
              <i className="fas fa-check-circle mr-2"></i>
              Location detected: {location.city}, {location.country}
            </p>
          </div>
        ) : null}
      </div>

      <LocationMap 
        coordinates={location.coordinates} 
        nearbyCampaignsCount={nearbyCampaigns.length}
      />

      {/* Nearby Campaigns Section - only shows if location is available and there are nearby campaigns */}
      {location.coordinates && nearbyCampaigns.length > 0 && nearbyCampaigns.length !== activeCampaigns.length && (
        <motion.div 
          className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <div className="mr-3 bg-blue-500 p-2 rounded-full">
                <i className="fas fa-map-marker-alt text-white"></i>
              </div>
              <h2 className="text-2xl font-heading font-bold text-blue-800">Near You</h2>
            </div>
            <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Based on your location • {nearbyCampaigns.length} campaign{nearbyCampaigns.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyCampaigns.map(campaign => (
              <CampaignTile key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </motion.div>
      )}

      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-heading font-bold">Active Campaigns</h2>
          <Link href="/campaigns" className="text-primary-dark hover:text-primary font-medium flex items-center cursor-pointer">
            View all <i className="fas fa-arrow-right ml-2"></i>
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
          <Link href="/results" className="text-primary-dark hover:text-primary font-medium flex items-center cursor-pointer">
            View all results <i className="fas fa-arrow-right ml-2"></i>
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
