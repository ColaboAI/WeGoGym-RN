import {
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabBarIndicatorProps,
  TabBarItemProps,
  TabView,
} from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';
import { Scene, Event } from 'react-native-tab-view/lib/typescript/src/types';
import { HomeStackScreenProps } from '/navigators/types';
import FirstRoute from '/components/organisms/Home/MyWorkoutPromise/FirstRoute';
import SecondRoute from '/components/organisms/Home/MyWorkoutPromise/SecondRoute';

type HomeScreenProps = HomeStackScreenProps<'MyWorkoutPromises'>;

export default function MyWorkoutPromisesScreen({
  navigation,
}: HomeScreenProps) {
  const theme = useTheme();
  const [limit] = useState<number>(10);
  const [offset] = useState<number>(0);

  const navigateToPromiseDetails = useCallback(
    (id: string) => {
      navigation.navigate('Details', { workoutPromiseId: id });
    },
    [navigation],
  );

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'first':
        return (
          <FirstRoute
            limit={limit}
            offset={offset}
            navigateToPromiseDetails={navigateToPromiseDetails}
          />
        );
      case 'second':
        return (
          <SecondRoute
            limit={limit}
            offset={offset}
            navigateToPromiseDetails={navigateToPromiseDetails}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = (
    props: JSX.IntrinsicAttributes &
      SceneRendererProps & {
        navigationState: NavigationState<Route>;
        scrollEnabled?: boolean | undefined;
        bounces?: boolean | undefined;
        activeColor?: string | undefined;
        inactiveColor?: string | undefined;
        pressColor?: string | undefined;
        pressOpacity?: number | undefined;
        getLabelText?:
          | ((scene: Scene<Route>) => string | undefined)
          | undefined;
        getAccessible?:
          | ((scene: Scene<Route>) => boolean | undefined)
          | undefined;
        getAccessibilityLabel?:
          | ((scene: Scene<Route>) => string | undefined)
          | undefined;
        getTestID?: ((scene: Scene<Route>) => string | undefined) | undefined;
        renderLabel?:
          | ((
              scene: Scene<Route> & { focused: boolean; color: string },
            ) => React.ReactNode)
          | undefined;
        renderIcon?:
          | ((
              scene: Scene<Route> & { focused: boolean; color: string },
            ) => React.ReactNode)
          | undefined;
        renderBadge?: ((scene: Scene<Route>) => React.ReactNode) | undefined;
        renderIndicator?:
          | ((props: TabBarIndicatorProps<Route>) => React.ReactNode)
          | undefined;
        renderTabBarItem?:
          | ((
              props: TabBarItemProps<Route> & { key: string },
            ) => React.ReactElement<
              any,
              string | React.JSXElementConstructor<any>
            >)
          | undefined;
        onTabPress?: ((scene: Scene<Route> & Event) => void) | undefined;
        onTabLongPress?: ((scene: Scene<Route>) => void) | undefined;
        tabStyle?: StyleProp<ViewStyle>;
        indicatorStyle?: StyleProp<ViewStyle>;
        indicatorContainerStyle?: StyleProp<ViewStyle>;
        labelStyle?: StyleProp<TextStyle>;
        contentContainerStyle?: StyleProp<ViewStyle>;
        style?: StyleProp<ViewStyle>;
        gap?: number | undefined;
        testID?: string | undefined;
        android_ripple?: PressableAndroidRippleConfig | undefined;
      },
  ) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.onBackground }}
      style={{ backgroundColor: theme.colors.background }}
      labelStyle={{ color: theme.colors.onBackground }}
    />
  );

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: '내가 만든 운동 약속' },
    { key: 'second', title: '내가 참여한 운동 약속' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}
