// src/styles/chartStyles.ts

export const DIPLO_COLORS = {
  background: '#ECFD00',       // luminous yellow
  magenta: '#FF2E92',          // bold magenta/pink
  grid: 'rgba(255, 46, 146, 0.2)', // soft grid lines
  label: '#111111',            // dark text
};

export const defaultChartMargins = {
  top: 10,
  right: 30,
  left: 0,
  bottom: 10,
};

export const tickStyle = {
  fontSize: 10,
  fill: DIPLO_COLORS.label,
};

export const shadowStyle = {
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  borderRadius: '12px',
  backgroundColor: DIPLO_COLORS.background,
  padding: '1rem',
};
