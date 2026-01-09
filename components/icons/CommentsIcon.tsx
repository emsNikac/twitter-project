import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function CommentsIcon({
  size = 24,
  color = '#e3e3e3',
}: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="none"
    >
      <Path
        fill={color}
        d="M240-400h320v-80H240zm0-120h480v-80H240zm0-120h480v-80H240zM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240zm126-240h594v-480H160v525zm-46 0v-480z"
      />
    </Svg>
  );
}
