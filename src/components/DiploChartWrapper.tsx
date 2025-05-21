// src/components/DiploChartWrapper.tsx
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  background?: string;
  borderColor?: string;
};

export default function DiploChartWrapper({
  children,
  background = '#0B0F1C',
  borderColor = '#FF2E92',
}: Props) {
  return (
    <div
      className="rounded-2xl p-4 shadow"
      style={{
        backgroundColor: background,
        border: `2px solid ${borderColor}`,
      }}
    >
      {children}
    </div>
  );
}
