import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SendPlaneSvgProps {
  size?: number;
  color?: string;
}

export function SendPlaneSvg({
  size = 20,
  color = '#FFFFFF',
}: SendPlaneSvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
