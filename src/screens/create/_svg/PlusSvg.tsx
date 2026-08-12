import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export function PlusSvg({
  width = 28,
  height = 28,
  color = '#8F8F8F',
  strokeWidth = 2.2,
  ...props
}: SvgProps & { color?: string; strokeWidth?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
