// src/styles/chartStyles.ts

export const DIPLO_COLORS = {
  background: '#ECFD00',
  foreground: '#FF2E92',
  heartbeat: '#C4C4C4', // soft contrast ripple for ambient pulses (adjust as needed)
};

export const defaultChartMargins = {
  top: 10,
  right: 20,
  left: 10,
  bottom: 10,
};

export const tickStyle = {
  fontSize: 10,
  fill: DIPLO_COLORS.foreground,
};

export const axisLineStyle = {
  stroke: DIPLO_COLORS.foreground,
};

export const gridStyle = {
  stroke: DIPLO_COLORS.foreground,
  strokeDasharray: '3 3',
};

export const chartWrapperStyle = {
  backgroundColor: DIPLO_COLORS.background,
  borderRadius: '0.5rem',
};
