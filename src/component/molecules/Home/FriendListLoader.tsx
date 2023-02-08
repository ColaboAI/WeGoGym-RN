import { useTheme } from '@react-navigation/native';
import React from 'react';
import ContentLoader, {
  IContentLoaderProps,
  Circle,
  Rect,
} from 'react-content-loader/native';
import { View } from 'react-native';

const FriendListLoader = (
  props: JSX.IntrinsicAttributes & IContentLoaderProps,
) => {
  const theme = useTheme();
  return (
    <View>
      <ContentLoader
        speed={2}
        width={400}
        height={120}
        viewBox="0 0 400 100"
        backgroundColor={theme.colors.background}
        foregroundColor={theme.colors.card}
        {...props}>
        <Circle cx="70" cy="40" r="40" />
        <Rect x="45" y="85" rx="5" ry="5" width="50" height="30" />
        <Circle cx="200" cy="40" r="40" />
        <Rect x="175" y="85" rx="5" ry="5" width="50" height="30" />
        <Circle cx="330" cy="40" r="40" />
        <Rect x="305" y="85" rx="5" ry="5" width="50" height="30" />
      </ContentLoader>
    </View>
  );
};

export default FriendListLoader;
