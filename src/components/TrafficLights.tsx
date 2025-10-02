import { useAppState } from '@react-native-community/hooks';
import { useAtomValue } from 'jotai';
import React, { FC, useState } from 'react';
import { Image, ImageSourcePropType, NativeModules, Pressable, StyleSheet } from 'react-native';
import { isFullscreenAtom, themeAtom } from '../atoms';

interface TrafficLightButtonProps {
  normalIcon: ImageSourcePropType;
  hoverIcon: ImageSourcePropType;
  disabledIcon: ImageSourcePropType;
  appIsActive: boolean;
  isHovered: boolean;
  onPress: () => void;
}

const TrafficLightButton: FC<TrafficLightButtonProps> = ({
  normalIcon,
  hoverIcon,
  disabledIcon,
  appIsActive,
  isHovered,
  onPress,
}) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Image style={[styles.icon, { opacity: isHovered ? 1 : 0 }]} source={hoverIcon} />
      <Image style={[styles.icon, { opacity: !isHovered && appIsActive ? 1 : 0 }]} source={normalIcon} />
      <Image style={[styles.icon, { opacity: !isHovered && !appIsActive ? 1 : 0 }]} source={disabledIcon} />
    </Pressable>
  );
};

/**
 * Custom traffic light buttons for macOS window control.
 * These replace the original traffic lights with custom styled buttons that provide
 * close, minimize, and zoom functionality while maintaining the native macOS look and feel.
 */
export const TrafficLights: FC = () => {
  const currentAppState = useAppState();
  const appIsActive = currentAppState === 'active';
  const theme = useAtomValue(themeAtom);
  const [isHovered, setIsHovered] = useState(false);
  const isFullscreen = useAtomValue(isFullscreenAtom);

  const closeIconNormal = require('../assets/traffic-lights/close.png');
  const closeIconHover = require('../assets/traffic-lights/close-hover.png');
  const minimizeIconNormal = require('../assets/traffic-lights/minimize.png');
  const minimizeIconHover = require('../assets/traffic-lights/minimize-hover.png');
  const zoomIconNormal = require('../assets/traffic-lights/zoom.png');
  const zoomIconHover = require('../assets/traffic-lights/zoom-hover.png');
  const disabledIcon =
    theme.type === 'dark'
      ? require('../assets/traffic-lights/disabled-dark.png')
      : require('../assets/traffic-lights/disabled-light.png');

  if (isFullscreen) {
    return null;
  }

  function closeWindow() {
    NativeModules.TrafficLightManager.closeWindow();
  }

  function minimizeWindow() {
    NativeModules.TrafficLightManager.minimizeWindow();
  }

  function toggleFullscreen() {
    NativeModules.TrafficLightManager.toggleFullscreen();
  }

  return (
    <Pressable style={styles.container} onHoverIn={() => setIsHovered(true)} onHoverOut={() => setIsHovered(false)}>
      <TrafficLightButton
        normalIcon={closeIconNormal}
        hoverIcon={closeIconHover}
        disabledIcon={disabledIcon}
        appIsActive={appIsActive}
        isHovered={isHovered}
        onPress={closeWindow}
      />
      <TrafficLightButton
        normalIcon={minimizeIconNormal}
        hoverIcon={minimizeIconHover}
        disabledIcon={disabledIcon}
        appIsActive={appIsActive}
        isHovered={isHovered}
        onPress={minimizeWindow}
      />
      <TrafficLightButton
        normalIcon={zoomIconNormal}
        hoverIcon={zoomIconHover}
        disabledIcon={disabledIcon}
        appIsActive={appIsActive}
        isHovered={isHovered}
        onPress={toggleFullscreen}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999999,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    padding: 2,
    margin: 18,
  },
  button: {
    position: 'relative',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 12,
    height: 12,
  },
});
