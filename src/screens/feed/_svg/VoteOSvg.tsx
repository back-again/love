import React from 'react';
import Svg, { Circle } from 'react-native-svg';

interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export function VoteOSvg({
  width = 16,
  height = 16,
  color = '#AA6CFF',
  strokeWidth = 3,
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={12}
        r={9}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </Svg>
  );
}
