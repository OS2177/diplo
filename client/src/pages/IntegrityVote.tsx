import React, { useState } from "react";
import { motion } from "framer-motion";
import IntegrityVotingCard from "@/components/IntegrityVotingCard";

const dummyPending = [
  {
    id: "123",
    title: "Global Ceasefire Mandate",
    summary: "A proposed resolution for global ceasefire recognition in UN.",
    type: "Global",
    upvotes: 0,
    downvotes: 0
  }
];

export default function IntegrityVote() {
  const [pendingCampaigns, setPendingCampaigns] = useState(dummyPending);

  const handleVote = (campaignId: string, decision: 'approve' | 'flag', reason?: string) => {
    setPendingCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? {
              ...c,
              upvotes: decision === 'approve' ? c.upvotes + 1 : c.upvotes,
              downvotes: decision === 'flag' ? c.downvotes + 1 : c.downvotes
            }
          : c
      )
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
          Review proposed campaigns and help maintain the quality of our platform by voting on their legitimacy.
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}