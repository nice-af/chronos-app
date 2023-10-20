import { HostComponent, ViewStyle, requireNativeComponent } from 'react-native';

interface BackgroundViewProps {
  style: ViewStyle;
  children?: React.ReactNode;
  // @see https://developer.apple.com/documentation/appkit/nsvisualeffectview/1535468-blendingmode
  blendingMode?: 0 | 1;
  // @see https://developer.apple.com/documentation/appkit/nsvisualeffectview/material/
  material?: number;
}

const BackgroundView: HostComponent<BackgroundViewProps> = requireNativeComponent('BackgroundView');

export default BackgroundView;
