import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface NativeViewProps {
  style: ViewStyle | ViewStyle[];
  children?: ReactNode;
  type: 'sidebar' | 'toolbar';
}
