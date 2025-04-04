import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import VoteResultsGraph from "@/components/VoteResultsGraph";
import { recentResults } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import Chart from "chart.js/auto";

const ResultsPage: React.FC = () => {
  const params = useParams();
  const [location] = useLocation();
  const [results, setResults] = useState(recentResults);
  const [resolvedResults, setResolvedResults] = useState(resolvedCampaigns);
  const [selectedResult, setSelectedResult] = useState<typeof recentResults[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // For detailed result view
    if (params && params.id) {
      const fetchDetailedResult = async () => {
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const foundResult = recentResults.find(r => r.id === params.id);
          
          if (foundResult) {
            setSelectedResult(foundResult);
          } else {
            toast({
              title: "Error",
              description: "Result not found",
              variant: "destructive"
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load result details",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };

      fetchDetailedResult();
    } else {
      // For list view
      const fetchResults = async () => {
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          // Results are already set from our mock data
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load results",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [params, toast]);

  // If we're on a specific result page and it's loaded
  if (params && params.id && !loading) {
    if (!selectedResult) {
      return (
        <div className="px-4 py-6 md:p-8">
          <div className="text-center py-10">
            <h2 className="text-2xl font-heading font-bold mb-4">Result Not Found</h2>
            <p className="text-neutral-600 mb-6">The result you're looking for doesn't exist or has been removed.</p>
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
              Ended {selectedResult.daysEnded} days ago
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
            {selectedResult.title} Results
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
              <h2 className="text-xl font-heading font-bold mb-4">Voting Results</h2>
              <div className="h-80">
                <canvas id="resultsChart"></canvas>
              </div>
              
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    // Chart would be initialized here in a real implementation
                    const ctx = document.getElementById('resultsChart');
                    new Chart(ctx, {
                      type: 'bar',
                      data: {
                        labels: ['In Favor', 'Against', 'Abstained'],
                        datasets: [{
                          label: '# of Votes',
                          data: [${selectedResult.inFavor}, ${100 - selectedResult.inFavor - 5}, 5],
                          backgroundColor: [
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(156, 163, 175, 0.8)'
                          ],
                          borderWidth: 0
                        }]
                      },
                      options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return value + '%';
                              }
                            }
                          }
                        },
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return context.raw + '%';
                              }
                            }
                          }
                        }
                      }
                    });
                  `
                }}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-neutral-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-neutral-500">Total Votes</p>
                  <p className="text-2xl font-bold text-neutral-800">{selectedResult.totalVotes.toLocaleString()}</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-neutral-500">Countries</p>
                  <p className="text-2xl font-bold text-neutral-800">{selectedResult.countriesParticipated}</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-neutral-500">In Favor</p>
                  <p className="text-2xl font-bold text-secondary">{selectedResult.inFavor}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-heading font-bold mb-4">Geographic Distribution</h2>
              <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
                <p className="text-neutral-500">World map showing vote distribution by region would be displayed here</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-heading font-bold mb-4">Analysis</h2>
              <p className="text-neutral-600 mb-4">
                This initiative received strong support with {selectedResult.inFavor}% of voters in favor.
                Participation was widespread, spanning {selectedResult.countriesParticipated} countries.
              </p>
              
              <h3 className="font-bold text-lg mt-6 mb-2">Key Insights</h3>
              <ul className="space-y-2 text-neutral-600">
                <li className="flex items-start gap-2">
                  <i className="fas fa-chart-line text-primary-light mt-1 w-5"></i>
                  <span>Highest participation came from Europe and North America</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-chart-line text-primary-light mt-1 w-5"></i>
                  <span>Support was strongest among urban populations</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-chart-line text-primary-light mt-1 w-5"></i>
                  <span>Results exceeded the required threshold for adoption</span>
                </li>
              </ul>
              
              <h3 className="font-bold text-lg mt-6 mb-2">Next Steps</h3>
              <p className="text-neutral-600">
                These results have been submitted to relevant international bodies for consideration
                in upcoming policy discussions.
              </p>
              
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <Button className="w-full">Download Full Report (PDF)</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // List view of all results
  if (loading) {
    return (
      <div className="px-4 py-6 md:p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading results...</p>
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
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
          Campaign Results
        </h1>
        <p className="mt-3 text-lg text-neutral-600 max-w-3xl">
          Browse completed campaigns and their voting outcomes. Detailed analysis is available for each result.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(result => (
          <VoteResultsGraph key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
