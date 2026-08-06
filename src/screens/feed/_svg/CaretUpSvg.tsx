import React from 'react';
import Svg, { Polygon } from 'react-native-svg';

interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

export function CaretUpSvg({
  width = 14,
  height = 10,
  color = '#0F172A',
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Polygon points="12,6 4,18 20,18" fill={color} />
    </Svg>
  );
}
