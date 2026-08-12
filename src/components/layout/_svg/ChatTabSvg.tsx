import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface TabSvgProps {
  isActive: boolean;
  color: string;
}

export function ChatTabSvg({ isActive, color }: TabSvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 11.5C21 15.6421 17.1944 19 12.5 19C11.1378 19 9.85177 18.7093 8.71077 18.1884L3 20L4.70757 15.8202C3.63007 14.5772 3 13.1026 3 11.5C3 7.35786 6.80558 4 11.5 4C16.1944 4 21 7.35786 21 11.5Z"
        fill={isActive ? color : 'none'}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
