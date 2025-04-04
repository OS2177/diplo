
import React from "react";
import { motion } from "framer-motion";

interface ResultsBarProps {
  label: string;
  percent: number;
  color: string;
  total?: number;
}

const ResultsBar: React.FC<ResultsBarProps> = ({ label, percent, color, total }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-neutral-700">{label}</span>
        <div className="text-right">
          <span className="font-bold text-lg">{percent.toFixed(1)}%</span>
          {total && <span className="text-sm text-neutral-500 ml-2">({total} votes)</span>}
        </div>
      </div>
      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ResultsBar;
