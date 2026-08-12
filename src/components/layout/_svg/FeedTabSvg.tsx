import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

interface TabSvgProps {
  isActive: boolean;
  color: string;
}

export function FeedTabSvg({ isActive, color }: TabSvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={3}
        width={18}
        height={18}
        rx={4}
        fill={isActive ? color : 'none'}
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M7 8H17M7 12H17M7 16H12"
        stroke={isActive ? '#FFFFFF' : color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
