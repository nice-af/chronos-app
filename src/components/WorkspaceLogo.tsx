import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface WorkspaceLogoProps {
  size: number;
  workspaceUrl: string;
  borderRadius?: number;
}

export const WorkspaceLogo: FC<WorkspaceLogoProps> = ({ size, borderRadius, workspaceUrl }) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const uri = `${workspaceUrl}/jira-logo-scaled.png`;

  useEffect(() => {
    Image.getSize(uri, (width, height) => {
      setDimensions({ width, height });
    });
  }, [uri]);

  if (dimensions) {
    const { width, height } = dimensions;
    const isLandscape = width > height;
    const newHeight = isLandscape ? size : (size / width) * height;
    const newWidth = isLandscape ? (size / height) * width : size;
    return (
      <View style={[styles.logoContainer, { width: size, height: size, borderRadius }]}>
        <Image style={{ width: newWidth, height: newHeight }} source={{ uri }} />
      </View>
    );
  }

  return <View style={styles.logoContainer} />;
};

const styles = StyleSheet.create({
  logoContainer: {
    overflow: 'hidden',
  },
});
