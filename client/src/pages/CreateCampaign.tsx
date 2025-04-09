
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import CreateCampaignForm from "@/components/CreateCampaignForm";

export default function CreateCampaign() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (campaign: any) => {
    // In a real app, this would be an API call
    console.log("New campaign:", campaign);
    setSubmitted(true);
    toast({
      title: "Campaign Submitted",
      description: "Your campaign is now pending integrity review.",
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
          Propose a Campaign
        </h1>
        <p className="mt-3 text-lg text-neutral-600 max-w-3xl">
          Submit your campaign proposal for community review. All campaigns must pass integrity voting before going live.
        </p>
      </motion.div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 p-6 rounded-xl border border-green-200"
        >
          <h2 className="text-xl font-heading font-bold text-green-800">Thank You!</h2>
          <p className="text-green-700">Your campaign has been submitted and is now pending integrity review.</p>
        </motion.div>
      ) : (
        <div className="max-w-2xl">
          <CreateCampaignForm onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
