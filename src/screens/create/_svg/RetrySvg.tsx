import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export function RetrySvg({
  width = 16,
  height = 16,
  color = '#FF5D7B',
  strokeWidth = 2.2,
  ...props
}: SvgProps & { color?: string; strokeWidth?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.57 2.57L21 8M21 3v5h-5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
