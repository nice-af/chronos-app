import React from 'react';
import { HostComponent, ViewStyle, requireNativeComponent } from 'react-native';
import { NativeViewProps } from './NativeView.types';

interface NativeViewNativeComponentProps {
  style: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  // @see https://developer.apple.com/documentation/appkit/nsvisualeffectview/1535468-blendingmode
  blendingMode?: 0 | 1;
  // @see https://developer.apple.com/documentation/appkit/nsvisualeffectview/material/
  material?: number;
}

export const NativeViewNativeComponent: HostComponent<NativeViewNativeComponentProps> =
  requireNativeComponent('NativeView');

export const NativeView: React.FC<NativeViewProps> = ({ style, type, children }) => {
  let props = {};

  if (type === 'toolbar') {
    props = {
      blendingMode: 1,
      material: 3,
    };
  } else if (type === 'sidebar') {
    props = {
      blendingMode: 0,
      material: 7,
    };
  }

  return (
    <NativeViewNativeComponent style={style} {...props}>
      {children}
    </NativeViewNativeComponent>
  );
};
