import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../constants/colors';

type Props = {
  size?: number;
  filled?: boolean;
  color?: string;
};

export default function RetweetIcon({
  size = 24,
  filled = false,
  color = '#e3e3e3',
}: Props) {
  const fillColor = filled ? Colors.retweeted : color ?? Colors.notRetweeted;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="none"
    >
      <Path
        fill={fillColor}
        d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160z"
      />
    </Svg>
  );
}
