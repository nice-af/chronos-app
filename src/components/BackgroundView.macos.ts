import { HostComponent, ViewStyle, requireNativeComponent } from 'react-native';

const BackgroundView: HostComponent<{ style: ViewStyle }> = requireNativeComponent('BackgroundView');

export default BackgroundView;
