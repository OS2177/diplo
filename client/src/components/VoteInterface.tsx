import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface VoteOption {
  id: string;
  label: string;
}

interface VoteInterfaceProps {
  campaignId: string;
  campaignTitle: string;
  options: VoteOption[];
  onVoteSubmit?: (optionId: string) => void;
}

const VoteInterface: React.FC<VoteInterfaceProps> = ({ 
  campaignId, 
  campaignTitle, 
  options, 
  onVoteSubmit 
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      toast({
        title: "Error",
        description: "Please select an option before submitting your vote.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would be an API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onVoteSubmit) {
        onVoteSubmit(selectedOption);
      }
      
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <h2 className="text-2xl font-heading font-bold mb-4">{campaignTitle}</h2>
      <p className="text-neutral-600 mb-6">
        Select your position on this issue. Your vote is anonymous and will be recorded securely.
      </p>
      
      <div className="space-y-3 mb-6">
        {options.map(option => (
          <motion.div
            key={option.id}
            className={`border rounded-lg p-4 cursor-pointer ${
              selectedOption === option.id 
                ? "border-primary-light bg-primary-light/10" 
                : "border-neutral-200 hover:border-neutral-300"
            }`}
            onClick={() => handleOptionSelect(option.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center">
              <div 
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === option.id 
                    ? "border-primary" 
                    : "border-neutral-300"
                }`}
              >
                {selectedOption === option.id && (
                  <motion.div 
                    className="w-2.5 h-2.5 rounded-full bg-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
              <span className="ml-3 font-medium">{option.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.button
        className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={!selectedOption || isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? "Submitting..." : "Submit Vote"}
      </motion.button>
      
      <p className="text-sm text-neutral-500 mt-4 text-center">
        By voting, you agree to the terms and privacy policy of Diplo platform.
      </p>
    </div>
  );
};

export default VoteInterface;
