import { useAppState } from '@react-native-community/hooks';
import { useAtomValue } from 'jotai';
import React, { FC, useState } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { isFullscreenAtom, themeAtom } from '../atoms';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';

interface TrafficLightButtonProps {
  normalIcon: ImageSourcePropType;
  hoverIcon: ImageSourcePropType;
  disabledIcon: ImageSourcePropType;
  appIsActive: boolean;
  isHovered: boolean;
}

const TrafficLightButton: FC<TrafficLightButtonProps> = ({
  normalIcon,
  hoverIcon,
  disabledIcon,
  appIsActive,
  isHovered,
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.button}>
      <Image style={[styles.icon, { opacity: isHovered ? 1 : 0 }]} source={hoverIcon} />
      <Image style={[styles.icon, { opacity: !isHovered && appIsActive ? 1 : 0 }]} source={normalIcon} />
      <Image style={[styles.icon, { opacity: !isHovered && !appIsActive ? 1 : 0 }]} source={disabledIcon} />
    </View>
  );
};

/**
 * The original traffic lights on MacOS have a visual bug with wrong hover zones in our button layout.
 * We fix that by using custom traffic light buttons for visuals, but the original ones for functionality.
 * The buttons here are therefore only for visuals and placed underneath the original ones.
 */
export const TrafficLights: FC = () => {
  const styles = useThemedStyles(createStyles);
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

  return (
    <Pressable style={styles.container} onHoverIn={() => setIsHovered(true)} onHoverOut={() => setIsHovered(false)}>
      <TrafficLightButton
        normalIcon={closeIconNormal}
        hoverIcon={closeIconHover}
        disabledIcon={disabledIcon}
        appIsActive={appIsActive}
        isHovered={isHovered}
      />
      <TrafficLightButton
        normalIcon={minimizeIconNormal}
        hoverIcon={minimizeIconHover}
        disabledIcon={disabledIcon}
        appIsActive={appIsActive}
        isHovered={isHovered}
      />
      <TrafficLightButton
        normalIcon={zoomIconNormal}
        hoverIcon={zoomIconHover}
        disabledIcon={disabledIcon}
        appIsActive={appIsActive}
        isHovered={isHovered}
      />
    </Pressable>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
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
}
