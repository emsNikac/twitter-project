import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../constants/colors';

type Props = {
  size?: number;
  filled?: boolean;
  color?: string;
};

export default function LikeIcon({
  size = 24,
  filled = false,
  color = '#e3e3e3',
}: Props) {
  const fillColor = filled ? Colors.tweetLiked : color ?? Colors.tweetNotLiked;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="none"
    >
      <Path
        fill={fillColor}
        d="m480-120-58-52q-101-91-167-157T150-447.5 95.5-544 80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5 705-329 538-172zm0-108q96-86 158-147.5t98-107 50-81 14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81 98 107T480-228m0-273"
      />
    </Svg>
  );
}
