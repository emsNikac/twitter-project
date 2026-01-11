import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function XLogo({
  size = 28,
  color = '#fff',
}: Props) {
  return (
    <Svg
      width={size}
      height={(size * 2260) / 2500}
      viewBox="0.254 0.25 500 451.954"
      fill="none"
    >
      <Path
        fill={color}
        d="M394.033.25h76.67L303.202 191.693l197.052 260.511h-154.29L225.118 294.205 86.844 452.204H10.127l179.16-204.77L.254.25H158.46l109.234 144.417zm-26.908 406.063h42.483L135.377 43.73h-45.59z"
      />
    </Svg>
  );
}