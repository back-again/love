import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

export function VoteStatsSvg({
  width = 16,
  height = 16,
  color = '#8F8F8F',
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={12} width={5} height={10} rx={2} fill={color} />
      <Rect x={9.5} y={6} width={5} height={16} rx={2} fill={color} />
      <Rect x={17} y={2} width={5} height={20} rx={2} fill={color} />
    </Svg>
  );
}
