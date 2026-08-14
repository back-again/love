import React from 'react';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

interface QuestionHeartSvgProps {
  size?: number;
}

export function QuestionHeartSvg({ size = 90 }: QuestionHeartSvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Path
        d="M50 85C50 85 15 55 15 32C15 18 26 8 40 8C47 8 50 14 50 14C50 14 53 8 60 8C74 8 85 18 85 32C85 55 50 85 50 85Z"
        fill="#FBFBFB"
        stroke="#E8E8E8"
        strokeWidth={3}
      />
      <SvgText
        fontSize="32"
        fontWeight="bold"
        fill="#FF5D7B"
        x="50"
        y="60"
        textAnchor="middle"
      >
        ?
      </SvgText>
    </Svg>
  );
}
