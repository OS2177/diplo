import React, { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import VoteInterface from "@/components/VoteInterface";
import { activeCampaigns } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/components/CampaignTile";

const CampaignPage: React.FC = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API fetch
    const fetchCampaign = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundCampaign = activeCampaigns.find(c => c.id === id);
        
        if (foundCampaign) {
          setCampaign(foundCampaign);
        } else {
          toast({
            title: "Error",
            description: "Campaign not found",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load campaign details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, toast]);

  const [voteResults, setVoteResults] = useState<{[key: string]: {votes: number, impact: number}}>({
    "for": { votes: 0, impact: 0 },
    "against": { votes: 0, impact: 0 },
    "abstain": { votes: 0, impact: 0 }
  });

  const handleVoteSubmit = (optionId: string, impact: number) => {
    setVoteResults(prev => ({
      ...prev,
      [optionId]: {
        votes: prev[optionId].votes + 1,
        impact: prev[optionId].impact + impact
      }
    }));
  };

  const totalVotes = Object.values(voteResults).reduce((acc, curr) => acc + curr.votes, 0);
  const totalImpact = Object.values(voteResults).reduce((acc, curr) => acc + curr.impact, 0);

  if (loading) {
    return (
      <div className="px-4 py-6 md:p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="px-4 py-6 md:p-8">
        <div className="text-center py-10">
          <h2 className="text-2xl font-heading font-bold mb-4">Campaign Not Found</h2>
          <p className="text-neutral-600 mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => window.history.back()} 
            className="bg-primary hover:bg-primary-dark"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Get the correct coordinates regardless of property naming
  const campaignLat = campaign.latitude || campaign.lat;
  const campaignLong = campaign.longitude || campaign.long;

  return (
    <div className="px-4 py-6 md:p-8">
      <motion.div 
        className="mb-6 md:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-2 flex items-center">
          <Button 
            variant="ghost" 
            className="p-0 mr-2" 
            onClick={() => window.history.back()}
          >
            <i className="fas fa-arrow-left"></i>
          </Button>
          <div className="flex items-center text-sm text-neutral-500">
            <i className={`fas ${campaign.scope === "Global" ? "fa-globe-americas" : "fa-map-marker-alt"} mr-2`}></i>
            <span>{campaign.scope === "Global" ? "Global Campaign" : `Regional: ${campaign.region}`}</span>
            <span className="mx-2">•</span>
            <span>{campaign.daysLeft} days left</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
          {campaign.title}
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-6">
            <div className="h-64 md:h-80 relative">
              <img 
                src={campaign.image} 
                className="w-full h-full object-cover" 
                alt={campaign.title} 
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded-full ${campaign.sponsor?.colorClass || 'bg-primary'} mr-2`}></div>
                <span className="text-sm text-neutral-500">{campaign.sponsor?.name || 'Campaign Sponsor'}</span>
              </div>
              
              <h2 className="text-2xl font-heading font-bold mb-4">About This Campaign</h2>
              <p className="text-neutral-600 mb-4">{campaign.description}</p>
              
              <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                <h3 className="font-bold mb-2">Details</h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-center gap-2">
                    <i className="fas fa-calendar-alt w-5 text-neutral-500"></i>
                    <span>Voting ends in {campaign.daysLeft} days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-user-check w-5 text-neutral-500"></i>
                    <span>{campaign.votes ? campaign.votes.toLocaleString() : '0'} votes so far</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-globe w-5 text-neutral-500"></i>
                    <span>
                      {campaign.scope === "Global" 
                        ? "Open to voters worldwide" 
                        : `Limited to voters in ${campaign.region}`}
                    </span>
                  </li>
                </ul>
              </div>
              
              <p className="text-sm text-neutral-500">
                This campaign adheres to Diplo's <span onClick={() => window.location.href = "/integrity"} className="text-primary-dark hover:underline cursor-pointer">integrity standards</span> and has been verified by our community.
              </p>
            </div>
          </div>
          
          <motion.div 
            className="mb-6 md:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <VoteInterface 
              campaignId={campaign.id} 
              campaignTitle="Cast Your Vote"
              options={[
                { id: "for", label: "I support this initiative" },
                { id: "against", label: "I oppose this initiative" },
                { id: "abstain", label: "I choose to abstain" }
              ]} 
              onVoteSubmit={handleVoteSubmit}
              campaignLat={campaignLat}
              campaignLong={campaignLong}
              radius={campaign.radius}
            />
          </motion.div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-heading font-bold mb-4">Discussion</h2>
            <p className="text-neutral-600 text-center py-8">
              Comments and discussion will be available here after you vote.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="hidden lg:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sticky top-8">
            <VoteInterface 
              campaignId={campaign.id} 
              campaignTitle="Cast Your Vote"
              options={[
                { id: "for", label: "I support this initiative" },
                { id: "against", label: "I oppose this initiative" },
                { id: "abstain", label: "I choose to abstain" }
              ]} 
              onVoteSubmit={handleVoteSubmit}
              campaignLat={campaignLat}
              campaignLong={campaignLong}
              radius={campaign.radius}
            />
          </div>

          {totalVotes > 0 && (
            <motion.div 
              className="mt-8 bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-heading font-bold mb-6">Live Results</h2>
              <ResultsBar 
                label="In Favor" 
                percent={(voteResults.for.impact / totalImpact) * 100} 
                color="#4CAF50"
                total={voteResults.for.votes}
              />
              <ResultsBar 
                label="Against" 
                percent={(voteResults.against.impact / totalImpact) * 100} 
                color="#f44336"
                total={voteResults.against.votes}
              />
              <ResultsBar 
                label="Abstained" 
                percent={(voteResults.abstain.impact / totalImpact) * 100} 
                color="#9e9e9e"
                total={voteResults.abstain.votes}
              />
              <p className="text-sm text-neutral-500 mt-4 text-center">
                Total votes: {totalVotes} • Combined impact: {totalImpact.toFixed(1)}%
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CampaignPage;
