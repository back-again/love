import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

export function ReviewSvg({
  width = 16,
  height = 16,
  color = '#334155',
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={5}
        width={18}
        height={14}
        rx={4}
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M4.5 7.5l7.5 5 7.5-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
