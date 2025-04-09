
import React, { useState } from "react";
import { motion } from "framer-motion";
import IntegrityVotingCard from "@/components/IntegrityVotingCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export default function IntegrityVote() {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);

  useEffect(() => {
    const fetchPendingCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching pending campaigns:', error);
        return;
      }

      setPendingCampaigns(data || []);
    };

    fetchPendingCampaigns();
  }, []);

  const [pendingCampaigns, setPendingCampaigns] = useState(initialPending);
  const [promotedCampaigns, setPromotedCampaigns] = useState<typeof initialPending>([]);
  const { toast } = useToast();

  const handleVote = async (campaignId: string, decision: 'approve' | 'flag', reason?: string) => {
    setPendingCampaigns(prev => 
      prev.map(c => {
        if (c.id === campaignId) {
          const newCampaign = {
            ...c,
            upvotes: decision === 'approve' ? c.upvotes + 1 : c.upvotes,
            downvotes: decision === 'flag' ? c.downvotes + 1 : c.downvotes
          };

          // Auto-promote logic
          if (newCampaign.upvotes - newCampaign.downvotes >= 3) {
            const promotedCampaign = { ...newCampaign, status: 'live' };
            
            // Update server status
            fetch(`/api/campaigns/${campaignId}/promote`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            }).then(() => {
              setPromotedCampaigns(prev => [...prev, promotedCampaign]);
              setPendingCampaigns(current => current.filter(camp => camp.id !== campaignId));
              toast({
                title: "Campaign Promoted",
                description: `${newCampaign.title} has been promoted to live status.`
              });
            });
            
            return null; // Remove from pending
          }
          return newCampaign;
        }
        return c;
      }).filter(Boolean)
    );
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
          Integrity Voting
        </h1>
        <p className="mt-3 text-lg text-neutral-600 max-w-3xl">
          Review proposed campaigns and help maintain the quality of our platform. Campaigns need 3 more approvals than flags to go live.
        </p>
      </motion.div>

      <div className="grid gap-6">
        {pendingCampaigns.map(campaign => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <IntegrityVotingCard
              campaignId={campaign.id}
              campaignTitle={campaign.title}
              issueDescription={campaign.summary}
              onVoteSubmit={(decision, reason) => handleVote(campaign.id, decision, reason)}
            />
            <div className="mt-2 text-sm text-neutral-600">
              Net votes: {campaign.upvotes - campaign.downvotes} (need 3 to promote)
            </div>
          </motion.div>
        ))}
      </div>

      {promotedCampaigns.length > 0 && (
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-6">
            Recently Promoted Campaigns
          </h2>
          <div className="grid gap-4">
            {promotedCampaigns.map(campaign => (
              <div 
                key={campaign.id}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <h3 className="font-heading font-bold text-green-800">
                  {campaign.title}
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  Successfully promoted to live status
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
