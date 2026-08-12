import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface TabSvgProps {
  isActive: boolean;
  color: string;
}

export function CreateTabSvg({ isActive, color }: TabSvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        fill={isActive ? color : 'none'}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
