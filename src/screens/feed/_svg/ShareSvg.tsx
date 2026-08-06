import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

export function ShareSvg({
  width = 16,
  height = 16,
  color = '#334155',
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 17c0-4.5 3-8 8.5-8H18M15 5l5 4-5 4"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
