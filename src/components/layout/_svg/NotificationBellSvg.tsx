import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface NotificationBellSvgProps {
  color?: string;
  size?: number;
}

export function NotificationBellSvg({
  color = '#0F172A',
  size = 24,
}: NotificationBellSvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.27 20a2 2 0 003.46 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
