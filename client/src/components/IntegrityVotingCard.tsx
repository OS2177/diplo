import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface IntegrityVotingCardProps {
  campaignId: string;
  campaignTitle: string;
  issueDescription: string;
  onVoteSubmit?: (decision: 'approve' | 'flag', reason?: string) => void;
}

const IntegrityVotingCard: React.FC<IntegrityVotingCardProps> = ({
  campaignId,
  campaignTitle,
  issueDescription,
  onVoteSubmit
}) => {
  const [decision, setDecision] = useState<'approve' | 'flag' | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!decision) {
      toast({
        title: "Error",
        description: "Please select whether to approve or flag this campaign.",
        variant: "destructive"
      });
      return;
    }

    if (decision === 'flag' && !reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for flagging this campaign.",
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
        onVoteSubmit(decision, decision === 'flag' ? reason : undefined);
      }
      
      toast({
        title: "Integrity Vote Submitted",
        description: decision === 'approve' 
          ? "You have approved this campaign for voting." 
          : "You have flagged this campaign for review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your integrity vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center mb-4">
        <div className="bg-accent-light p-2 rounded-lg text-white mr-3">
          <i className="fas fa-shield-alt"></i>
        </div>
        <h2 className="text-xl font-heading font-bold">Integrity Review</h2>
      </div>
      
      <div className="mb-6">
        <h3 className="font-heading font-bold text-lg mb-2">{campaignTitle}</h3>
        <p className="text-neutral-600 text-sm">{issueDescription}</p>
      </div>
      
      <div className="space-y-4 mb-6">
        <p className="font-medium">Does this campaign meet Diplo's integrity standards?</p>
        
        <motion.div
          className={`border rounded-lg p-4 cursor-pointer ${
            decision === 'approve' 
              ? 'border-secondary-light bg-secondary-light/10' 
              : 'border-neutral-200 hover:border-neutral-300'
          }`}
          onClick={() => setDecision('approve')}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center">
            <div 
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                decision === 'approve' 
                  ? 'border-secondary' 
                  : 'border-neutral-300'
              }`}
            >
              {decision === 'approve' && (
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-secondary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
            <span className="ml-3 font-medium">Yes, approve this campaign</span>
          </div>
        </motion.div>
        
        <motion.div
          className={`border rounded-lg p-4 cursor-pointer ${
            decision === 'flag' 
              ? 'border-destructive bg-destructive/10' 
              : 'border-neutral-200 hover:border-neutral-300'
          }`}
          onClick={() => setDecision('flag')}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center">
            <div 
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                decision === 'flag' 
                  ? 'border-destructive' 
                  : 'border-neutral-300'
              }`}
            >
              {decision === 'flag' && (
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-destructive"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
            <span className="ml-3 font-medium">No, flag for review</span>
          </div>
          
          {decision === 'flag' && (
            <motion.div 
              className="mt-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <textarea
                className="w-full border border-neutral-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Please provide a reason for flagging this campaign"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <Button
        className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={!decision || (decision === 'flag' && !reason.trim()) || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Integrity Vote"}
      </Button>
      
      <p className="text-sm text-neutral-500 mt-4 text-center">
        Integrity voting helps maintain the quality and legitimacy of campaigns on Diplo.
      </p>
    </div>
  );
};

export default IntegrityVotingCard;
