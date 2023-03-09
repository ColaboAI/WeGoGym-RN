import {
  Alert,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import React, { Suspense, useCallback, useState } from 'react';
import {
  NavigationState,
  Route,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabBarIndicatorProps,
  TabBarItemProps,
  TabView,
} from 'react-native-tab-view';
import { Button, Headline, useTheme } from 'react-native-paper';
import { Scene, Event } from 'react-native-tab-view/lib/typescript/src/types';
import { useGetWorkoutByUserIdQuery } from '/hooks/queries/workout.queries';
import WorkoutPromiseLoader from '/components/molecules/Home/WorkoutPromiseLoader';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import WorkoutPromiseCard from '/components/molecules/Home/WorkoutPromiseCard';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { HomeStackScreenProps } from '/navigators/types';

type HomeScreenProps = HomeStackScreenProps<'MyWorkoutPromises'>;

export default function MyWorkoutPromisesScreen({
  navigation,
}: HomeScreenProps) {
  const theme = useTheme();
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const { reset } = useQueryErrorResetBoundary();
  const query = useGetWorkoutByUserIdQuery('me', limit, offset);

  const navigateToPromiseDetails = useCallback(
    (id: string) => {
      navigation.navigate('Details', { workoutPromiseId: id });
    },
    [navigation],
  );

  // 내가 만든 운동 약속
  const FirstRoute = () => (
    <Suspense fallback={<WorkoutPromiseLoader />}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <Headline>
            There was an error!
            <Button
              onPress={() => {
                resetErrorBoundary();
                Alert.alert("I'm error boundary");
              }}>
              Try again
            </Button>
          </Headline>
        )}>
        <View
          style={[
            style.container,
            { backgroundColor: theme.colors.background },
          ]}>
          {query.data ? (
            <FlatList
              data={query.data.items}
              keyExtractor={item => item.id}
              contentContainerStyle={style.workoutPromiseContainer}
              initialNumToRender={5}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={`work-promise-container-${item.id}`}
                  onPress={() => {
                    navigateToPromiseDetails(item.id);
                  }}>
                  <WorkoutPromiseCard
                    key={`work-promise-${item.id}`}
                    {...item}
                  />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <WorkoutPromiseLoader />
          )}
        </View>
      </ErrorBoundary>
    </Suspense>
  );
  // 내가 참여한 운동 약속
  const SecondRoute = () => (
    <View
      style={[style.container, { backgroundColor: theme.colors.background }]}
    />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

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
      onTabPress={({ route }) => {
        console.log(route);
      }}
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

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  workoutPromiseContainer: {
    flexGrow: 1,
  },
});
