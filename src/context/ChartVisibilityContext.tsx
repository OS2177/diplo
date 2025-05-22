import { createContext, useContext, useState, ReactNode } from 'react';

type ChartVisibility = {
  campaignIntegrity: boolean;
  campaignScope: boolean;
  communityIntegrityMap: boolean;
  proximityReach: boolean;
  voteImpactMatrix: boolean;
  voteMap: boolean;
  voteMomentum: boolean;
  voteOriginMap: boolean;
  votePulse: boolean;
  voterAge: boolean;
  voterGender: boolean;
  voterIntegrity: boolean;
  voteSplit: boolean;
};

type ContextType = {
  visibility: ChartVisibility;
  toggleChart: (key: keyof ChartVisibility) => void;
};

const defaultVisibility: ChartVisibility = {
  campaignIntegrity: true,
  campaignScope: true,
  communityIntegrityMap: true,
  proximityReach: true,
  voteImpactMatrix: true,
  voteMap: true,
  voteMomentum: true,
  voteOriginMap: true,
  votePulse: true,
  voterAge: true,
  voterGender: true,
  voterIntegrity: true,
  voteSplit: true,
};

const ChartVisibilityContext = createContext<ContextType | undefined>(undefined);

export function ChartVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibility, setVisibility] = useState<ChartVisibility>(defaultVisibility);

  const toggleChart = (key: keyof ChartVisibility) => {
    setVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ChartVisibilityContext.Provider value={{ visibility, toggleChart }}>
      {children}
    </ChartVisibilityContext.Provider>
  );
}

export function useChartVisibility() {
  const context = useContext(ChartVisibilityContext);
  if (!context) {
    throw new Error('useChartVisibility must be used within a ChartVisibilityProvider');
  }
  return context;
}
