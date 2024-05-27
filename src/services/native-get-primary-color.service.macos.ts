import { NativeModules } from 'react-native';

export async function getPrimaryColorFromImage(imageUrl: string) {
  return await NativeModules.ReactNativeImageColors.getPrimaryColorFromImage(imageUrl);
}
