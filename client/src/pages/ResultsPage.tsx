
import React from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { resolvedCampaigns, recentResults } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

const ResultsPage: React.FC = () => {
  const { toast } = useToast();
  const params = useParams();
  const [location, setLocation] = useLocation();

  // If we have an ID parameter, find that specific result
  const result = params.id 
    ? resolvedCampaigns.find(r => r.id === params.id)
    : null;

  // If no specific result found but ID was provided, show error state
  if (params.id && !result) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Result Not Found</h1>
        <p className="mt-2 text-gray-600">The requested result could not be found.</p>
        <Button 
          onClick={() => setLocation('/results')}
          className="mt-4"
        >
          View All Results
        </Button>
      </div>
    );
  }

  // Show all results if no specific ID provided
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {result ? 'Campaign Results' : 'Recent Results'}
      </h1>
      
      <div className="space-y-4">
        {result ? (
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{result.title}</h2>
            <p className="text-gray-600 mt-2">Ended {result.daysEnded} days ago</p>
            <div className="mt-4">
              <p>In Favor: {result.inFavor}%</p>
              <p>Countries Participated: {result.countriesParticipated}</p>
              <p>Total Votes: {result.totalVotes}</p>
            </div>
          </div>
        ) : (
          recentResults.map(result => (
            <motion.div
              key={result.id}
              className="border rounded-lg p-4 cursor-pointer hover:border-primary"
              onClick={() => setLocation(`/results/${result.id}`)}
              whileHover={{ scale: 1.01 }}
            >
              <h2 className="text-xl font-semibold">{result.title}</h2>
              <p className="text-gray-600 mt-2">Ended {result.daysEnded} days ago</p>
              <div className="mt-4">
                <p>In Favor: {result.inFavor}%</p>
                <p>Countries Participated: {result.countriesParticipated}</p>
                <p>Total Votes: {result.totalVotes}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
