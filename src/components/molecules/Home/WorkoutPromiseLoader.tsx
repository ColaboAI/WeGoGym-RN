import { useTheme } from '@react-navigation/native';
import React from 'react';
import ContentLoader, {
  IContentLoaderProps,
  Rect,
} from 'react-content-loader/native';
import { View } from 'react-native';

const WorkoutPromiseLoader = (
  props: JSX.IntrinsicAttributes & IContentLoaderProps,
) => {
  const theme = useTheme();
  return (
    <View>
      <ContentLoader
        speed={2}
        width={400}
        height={1000}
        viewBox="0 0 400 1000"
        backgroundColor={theme.colors.background}
        foregroundColor={theme.colors.card}
        {...props}>
        <Rect x="20" y="0" rx="5" ry="5" width="350" height="150" />
        <Rect x="20" y="160" rx="5" ry="5" width="350" height="150" />
        <Rect x="20" y="320" rx="5" ry="5" width="350" height="150" />
        <Rect x="20" y="480" rx="5" ry="5" width="350" height="150" />
        <Rect x="20" y="640" rx="5" ry="5" width="350" height="150" />
      </ContentLoader>
    </View>
  );
};

export default WorkoutPromiseLoader;
