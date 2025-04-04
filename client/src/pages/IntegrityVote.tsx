import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import IntegrityVotingCard from "@/components/IntegrityVotingCard";
import { activeCampaigns } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

const IntegrityVote: React.FC = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<typeof activeCampaigns[0] | null>(null);
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

  const handleIntegrityVoteSubmit = (decision: 'approve' | 'flag', reason?: string) => {
    console.log(`Integrity vote for campaign ${id}: ${decision}${reason ? `, Reason: ${reason}` : ''}`);
    // In a real app, this would make an API call
  };

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

  return (
    <div className="px-4 py-6 md:p-8">
      <motion.div 
        className="mb-8"
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
          <span className="text-sm text-neutral-500">
            Campaign Integrity Review
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
          Integrity Voting
        </h1>
        <p className="mt-3 text-lg text-neutral-600 max-w-3xl">
          Help maintain the quality of Diplo by reviewing campaigns against our community standards and integrity guidelines.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="h-48 relative">
              <img 
                src={campaign.image} 
                className="w-full h-full object-cover" 
                alt={campaign.title} 
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-heading font-bold mb-2">{campaign.title}</h2>
              <div className="flex items-center text-sm text-neutral-500 mb-4">
                <span className={`w-2 h-2 rounded-full ${campaign.sponsor.colorClass} mr-2`}></span>
                <span>{campaign.sponsor.name}</span>
                <span className="mx-2">•</span>
                <span>{campaign.scope === "Global" ? "Global" : `Regional: ${campaign.region}`}</span>
              </div>
              <p className="text-neutral-600 mb-4">{campaign.description}</p>
              
              <div className="bg-neutral-50 rounded-lg p-4">
                <h3 className="font-bold mb-2">Integrity Guidelines</h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-secondary-light mt-1 w-5"></i>
                    <span>Content must be accurate and verifiable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-secondary-light mt-1 w-5"></i>
                    <span>Campaign must not promote hate speech or violence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-secondary-light mt-1 w-5"></i>
                    <span>Must respect international laws and human rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-secondary-light mt-1 w-5"></i>
                    <span>Sponsor organization must be legitimate and transparent</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <IntegrityVotingCard 
            campaignId={campaign.id} 
            campaignTitle={campaign.title}
            issueDescription="Review this campaign against Diplo's integrity guidelines. Your vote helps ensure that all campaigns on our platform meet community standards."
            onVoteSubmit={handleIntegrityVoteSubmit}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default IntegrityVote;
