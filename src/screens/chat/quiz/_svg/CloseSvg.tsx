import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CloseSvgProps {
  size?: number;
  color?: string;
}

export function CloseSvg({ size = 20, color = '#8F8F8F' }: CloseSvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
