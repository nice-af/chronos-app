import React, { FC } from 'react';
import { View } from 'react-native';
import { NativeViewProps } from './NativeView.types';

export const NativeView: FC<NativeViewProps> = ({ style, children }) => {
  return <View style={style}>{children}</View>;
};
