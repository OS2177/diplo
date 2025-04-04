import React from "react";
import { motion } from "framer-motion";
import CreateCampaignForm from "@/components/CreateCampaignForm";

const CreateCampaign: React.FC = () => {
  return (
    <div className="px-4 py-6 md:p-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
          Create a New Campaign
        </h1>
        <p className="mt-3 text-lg text-neutral-600 max-w-3xl">
          Launch a global or regional voting campaign on an important issue. Provide clear information and set your campaign parameters below.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <CreateCampaignForm />
      </div>
    </div>
  );
};

export default CreateCampaign;
