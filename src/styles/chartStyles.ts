export const DIPLO_COLORS = {
  background: '#ECFD00', // legacy background
  foreground: '#FF2E92',
  heartbeat: '#C4C4C4',
  offWhite: '#F5F5F0',
  black: '#000000',
  magenta: '#FD1096',
  luminousYellow: '#DDFF00',
};

export const CHART_THEMES = {
  blackAndOffWhite: {
    background: DIPLO_COLORS.offWhite,
    foreground: DIPLO_COLORS.black,
  },
  luminousMagenta: {
    background: DIPLO_COLORS.luminousYellow,
    foreground: DIPLO_COLORS.magenta,
  },
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
