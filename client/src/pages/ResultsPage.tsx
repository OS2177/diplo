
import React from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import VoteResultsGraph from "@/components/VoteResultsGraph";
import { Button } from "@/components/ui/button";

const ResultsPage: React.FC = () => {
  const { toast } = useToast();
  const params = useParams();
  const [location, setLocation] = useLocation();

  // Simple placeholder data for now
  const dummyResult = {
    id: "1",
    title: "Sample Campaign",
    daysEnded: 2,
    inFavor: 75,
    countriesParticipated: 30,
    totalVotes: 1000
  };

  const handleGoBack = () => {
    window.history.back();
  };

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
            onClick={handleGoBack}
          >
            <i className="fas fa-arrow-left"></i>
          </Button>
          <span className="text-sm text-neutral-500">
            {params?.id ? `Ended ${dummyResult.daysEnded} days ago` : 'All Results'}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
          {params?.id ? `${dummyResult.title} Results` : 'Campaign Results'}
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {params?.id ? (
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-heading font-bold mb-4">Voting Results</h2>
            <div className="flex justify-center items-center h-64 bg-neutral-50 rounded-lg">
              <p className="text-neutral-500">Result details will be displayed here</p>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 text-center py-10">
            <p className="text-neutral-600">No results available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
