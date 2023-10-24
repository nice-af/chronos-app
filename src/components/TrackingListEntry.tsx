import transparentize from 'polished/lib/color/transparentize';
import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';
import { getPadding } from '../styles/utils';
import { TrackingEntry } from '../types/global.types';
import { IssueTag } from './IssueTag';
import { typo } from '../styles/typo';
import { PlayPauseButton } from './PlayPauseButton';

interface TrackingListEntryProps extends Omit<PressableProps, 'style'> {
  trackingEntry: TrackingEntry;
  isSelected?: boolean;
  onPress?: () => void;
}

export const TrackingListEntry: React.FC<TrackingListEntryProps> = ({ onPress, trackingEntry, isSelected }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, (isSelected || pressed) && styles.containerIsSelected]}>
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <IssueTag label={trackingEntry.tag} project={trackingEntry.project} />
          <Text numberOfLines={1} style={styles.title}>
            {trackingEntry.title}
          </Text>
        </View>
        <Text style={styles.description}>{trackingEntry.description}</Text>
      </View>
      <PlayPauseButton duration={trackingEntry.duration} isRunning={false} onPress={() => {}} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'transparent',
    ...getPadding(12, 16),
  },
  containerIsSelected: {
    backgroundColor: transparentize(0.96, colors.contrast),
  },
  infoContainer: {
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typo.headline,
    flex: 1,
    marginLeft: 8,
    marginTop: 2,
  },
  description: {
    marginTop: 8,
    ...typo.callout,
    color: colors.textSecondary,
  },
});
