import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BackChevronSvgProps {
  size?: number;
  color?: string;
}

export function BackChevronSvg({
  size = 22,
  color = '#0F172A',
}: BackChevronSvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18l-6-6 6-6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
