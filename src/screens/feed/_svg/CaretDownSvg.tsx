import React from 'react';
import Svg, { Polygon } from 'react-native-svg';

interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

export function CaretDownSvg({
  width = 14,
  height = 10,
  color = '#0F172A',
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Polygon points="4,6 20,6 12,18" fill={color} />
    </Svg>
  );
}
