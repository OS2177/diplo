import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userCampaigns, userProfile, activeCampaigns } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { getCurrentPosition, reverseGeocode } from "@/lib/geolocation";

const Dashboard: React.FC = () => {
  const [locationStatus, setLocationStatus] = useState<string>("");
  const { toast } = useToast();

  const refreshLocation = async () => {
    try {
      setLocationStatus("Detecting your location...");
      
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Get the city and country from coordinates
      const locationDetails = await reverseGeocode(latitude, longitude);
      
      setLocationStatus(`Location updated: ${locationDetails.city}, ${locationDetails.country}`);
      
      toast({
        title: "Location Updated",
        description: `Your location has been updated to ${locationDetails.city}, ${locationDetails.country}`,
      });
    } catch (error) {
      setLocationStatus(`Error: ${(error as Error).message}`);
      
      toast({
        title: "Error",
        description: `Failed to update location: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="px-4 py-6 md:p-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
          Dashboard
        </h1>
        <p className="mt-3 text-lg text-neutral-600 max-w-3xl">
          Manage your account, track your campaigns, and view your voting history.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-6">
            <div className="bg-primary-light/10 p-6">
              <div className="flex items-center">
                <img 
                  src={userProfile.avatar} 
                  className="w-16 h-16 rounded-full border-2 border-white" 
                  alt={userProfile.name} 
                />
                <div className="ml-4">
                  <h2 className="text-xl font-heading font-bold">{userProfile.name}</h2>
                  <p className="text-neutral-600">{userProfile.role}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Your Location</h3>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Current Location</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-2 text-primary-dark"
                      onClick={refreshLocation}
                    >
                      <i className="fas fa-sync-alt mr-1"></i> Update
                    </Button>
                  </div>
                  <p className="text-neutral-600">
                    {locationStatus || "New York, USA"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Account Settings</h3>
                <nav className="space-y-1">
                  <a className="flex items-center px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer">
                    <i className="fas fa-user-edit w-6"></i>
                    <span>Edit Profile</span>
                  </a>
                  <a className="flex items-center px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer">
                    <i className="fas fa-bell w-6"></i>
                    <span>Notifications</span>
                  </a>
                  <a className="flex items-center px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer">
                    <i className="fas fa-lock w-6"></i>
                    <span>Privacy Settings</span>
                  </a>
                  <a 
                    className="flex items-center px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt w-6"></i>
                    <span>Logout</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">My Campaigns</h3>
              {userCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {userCampaigns.map(campaign => (
                    <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
                      <div className="flex items-center p-3 hover:bg-neutral-50 rounded-lg cursor-pointer">
                        <span className={`w-3 h-3 rounded-full ${campaign.colorClass} mr-3`}></span>
                        <span className="text-neutral-800">{campaign.title}</span>
                        <i className="fas fa-chevron-right ml-auto text-neutral-400"></i>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-neutral-500">
                  <p>You haven't created any campaigns yet.</p>
                  <Link href="/create-campaign">
                    <div className="text-primary-dark font-medium mt-2 inline-block cursor-pointer">
                      Create your first campaign
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="voting-history">Voting History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary-light/20 p-2 rounded-full text-primary mr-3">
                      <i className="fas fa-vote-yea"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">You voted on "Climate Action Resolution"</p>
                      <p className="text-sm text-neutral-500">2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-accent-light/20 p-2 rounded-full text-accent mr-3">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">You submitted an integrity vote for "Digital Rights Treaty"</p>
                      <p className="text-sm text-neutral-500">3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-secondary-light/20 p-2 rounded-full text-secondary mr-3">
                      <i className="fas fa-plus-circle"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">You created a new campaign "Ocean Protection Initiative"</p>
                      <p className="text-sm text-neutral-500">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Recommended Campaigns</h3>
                  <Link href="/">
                    <div className="text-primary-dark text-sm cursor-pointer">
                      View all
                    </div>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {activeCampaigns.slice(0, 3).map(campaign => (
                    <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
                      <div className="flex items-center p-3 hover:bg-neutral-50 rounded-lg border border-neutral-200 cursor-pointer">
                        <span className={`w-2 h-2 rounded-full ${campaign.sponsor.colorClass} mr-3`}></span>
                        <div>
                          <p className="font-medium">{campaign.title}</p>
                          <p className="text-sm text-neutral-500">{campaign.daysLeft} days left • {campaign.votes.toLocaleString()} votes</p>
                        </div>
                        <i className="fas fa-chevron-right ml-auto text-neutral-400"></i>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="voting-history">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <h3 className="text-lg font-bold mb-4">Your Voting History</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Climate Action Resolution</p>
                        <p className="text-sm text-neutral-500">Voted: In favor</p>
                      </div>
                      <span className="text-xs text-neutral-500">2 days ago</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Digital Rights Treaty</p>
                        <p className="text-sm text-neutral-500">Voted: In favor</p>
                      </div>
                      <span className="text-xs text-neutral-500">5 days ago</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Educational Resources Treaty</p>
                        <p className="text-sm text-neutral-500">Voted: Abstained</p>
                      </div>
                      <span className="text-xs text-neutral-500">1 week ago</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Ocean Protection Initiative</p>
                        <p className="text-sm text-neutral-500">Voted: In favor</p>
                      </div>
                      <span className="text-xs text-neutral-500">2 weeks ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <h3 className="text-lg font-bold mb-6">Your Campaign Analytics</h3>
                
                <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg mb-6">
                  <p className="text-neutral-500">
                    Campaign performance analytics would be displayed here
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-neutral-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-neutral-500">Total Campaigns</p>
                    <p className="text-2xl font-bold text-neutral-800">3</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-neutral-500">Total Votes</p>
                    <p className="text-2xl font-bold text-neutral-800">37,393</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-neutral-500">Avg. Approval</p>
                    <p className="text-2xl font-bold text-secondary">73%</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
