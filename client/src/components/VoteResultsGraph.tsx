import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import Chart from "chart.js/auto";
import { VoteResult } from "@/lib/mockData";

interface VoteResultsGraphProps {
  result: VoteResult;
}

const VoteResultsGraph: React.FC<VoteResultsGraphProps> = ({ result }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['In Favor', 'Against'],
            datasets: [{
              data: [result.inFavor, 100 - result.inFavor],
              backgroundColor: [
                result.inFavor > 50 ? '#10B981' : '#F59E0B',
                '#E5E7EB'
              ],
              borderWidth: 0,
              cutout: '75%'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.raw}%`;
                  }
                }
              }
            }
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [result]);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading font-bold">{result.title}</h3>
        <span className="text-xs text-neutral-500">Ended {result.daysEnded} days ago</span>
      </div>
      <div className="h-60 flex items-center justify-center bg-neutral-50 rounded-lg mb-3">
        <div className="flex flex-col items-center w-full h-full">
          <div className="relative w-full h-full flex items-center justify-center">
            <canvas ref={chartRef} className="max-w-full max-h-full"></canvas>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <p className="text-3xl font-bold">{result.inFavor}%</p>
              <p className="text-sm font-medium">In favor</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-neutral-600">
        <span>{result.countriesParticipated} countries participated</span>
        <Link href={`/results/${result.id}`}>
          <div className="text-primary-dark hover:text-primary-light cursor-pointer">
            Full analysis →
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default VoteResultsGraph;
