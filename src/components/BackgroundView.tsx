import React from 'react';
import { View, ViewStyle } from 'react-native';

interface BackgroundViewProps {
  style: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  // @see https://developer.apple.com/documentation/appkit/nsvisualeffectview/1535468-blendingmode
  blendingMode?: 0 | 1;
  // @see https://developer.apple.com/documentation/appkit/nsvisualeffectview/material/
  material?: number;
}

const BackgroundView: React.FC<BackgroundViewProps> = ({ style, children }) => {
  return <View style={style}>{children}</View>;
};

export default BackgroundView;
