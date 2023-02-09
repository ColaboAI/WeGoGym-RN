import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = ScrollViewProps &
  React.PropsWithChildren<{
    withScrollView: boolean;
    withBottomTab: boolean;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
  }>;

export default function ScreenWrapper({
  children,
  withScrollView,
  withBottomTab,
  style,
  contentContainerStyle,
  ...rest
}: Props) {
  const theme = useTheme();

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const iosPaddingBottom = withBottomTab ? tabBarHeight : 0;
  const androidPaddingBottom = withBottomTab ? tabBarHeight + insets.bottom : 0;
  const containerStyle = [
    styles.container,
    {
      backgroundColor: theme.colors.background,
      paddingBottom:
        Platform.OS === 'ios' ? iosPaddingBottom : androidPaddingBottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingTop: insets.top,
    },
  ];

  return (
    <>
      {withScrollView ? (
        <ScrollView
          {...rest}
          contentContainerStyle={contentContainerStyle}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          style={[containerStyle, style]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[containerStyle, style]}>{children}</View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
