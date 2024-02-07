import React from 'react';
import { View } from 'react-native';
import { NativeViewProps } from './NativeView.types';

export const NativeView: React.FC<NativeViewProps> = ({ style, children }) => {
  return <View style={style}>{children}</View>;
};
