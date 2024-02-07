import { ViewStyle } from 'react-native';

export interface NativeViewProps {
  style: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  type: 'sidebar' | 'toolbar';
}
