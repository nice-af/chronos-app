import React from 'react';
import { PlatformColor, View, ViewStyle } from 'react-native-windows';
import { NativeViewProps } from './NativeView.types';

export const NativeView: React.FC<NativeViewProps> = ({ style, type, children }) => {
  let nativeStyle: ViewStyle = {};

  if (type === 'toolbar') {
    nativeStyle = {
      backgroundColor: PlatformColor('SystemControlAcrylicWindowBrush'),
    };
  } else if (type === 'sidebar') {
    nativeStyle = {
      backgroundColor: PlatformColor('SystemControlAcrylicWindowBrush'),
    };
  }

  return <View style={[style, nativeStyle]}>{children}</View>;
};
