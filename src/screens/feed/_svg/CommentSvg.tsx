import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

export function CommentSvg({
  width = 16,
  height = 16,
  color = '#475569',
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={4}
        width={18}
        height={13}
        rx={4.5}
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M7 17l-2.5 3v-3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={8} cy={10.5} r={1} fill={color} />
      <Circle cx={12} cy={10.5} r={1} fill={color} />
      <Circle cx={16} cy={10.5} r={1} fill={color} />
    </Svg>
  );
}
