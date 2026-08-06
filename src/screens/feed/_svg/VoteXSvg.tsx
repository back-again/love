import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export function VoteXSvg({
  width = 16,
  height = 16,
  color = '#FF858F',
  strokeWidth = 3,
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
