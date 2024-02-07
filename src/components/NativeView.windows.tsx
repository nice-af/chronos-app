import React from 'react';
import { PlatformColor, View, ViewStyle } from 'react-native-windows';
import { NativeViewProps } from './NativeView.types';

export const NativeView: React.FC<NativeViewProps> = ({ style, type, children }) => {
  let nativeStyle: ViewStyle = {};

  if (type === 'toolbar') {
    nativeStyle = {
      backgroundColor: PlatformColor('AcrylicInAppFillColorBaseBrush'),
    };
  } else if (type === 'sidebar') {
    nativeStyle = {
      backgroundColor: 'transparent',
    };
  }

  return <View style={[style, nativeStyle]}>{children}</View>;
};
