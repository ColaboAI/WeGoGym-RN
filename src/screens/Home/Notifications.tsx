import { StyleSheet, View } from 'react-native';
import React, { Suspense, useCallback, useState } from 'react';
import NotificationCard from '/components/molecules/Home/NotificationCard';
import WorkoutPromiseLoader from '/components/molecules/Home/WorkoutPromiseLoader';
import { ErrorBoundary } from 'react-error-boundary';
import { Text, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { useGetNotificationWorkoutQuery } from '/hooks/queries/notification.queries';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { HomeStackScreenProps } from '/navigators/types';

type HomeScreenProps = HomeStackScreenProps<'Notifications'>;

export default function NotificationsScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();
  const {
    data: notificationWorkoutList,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
  } = useGetNotificationWorkoutQuery();

  const { reset } = useQueryErrorResetBoundary();
  const [refreshing, setRefreshing] = useState(false);

  const navigateToUserDetails = useCallback(
    (id: string) => {
      navigation.navigate('User', { userId: id });
    },
    [navigation],
  );

  const navigateToWorkoutDetails = useCallback(
    (id: string) => {
      navigation.navigate('Details', { workoutPromiseId: id });
    },
    [navigation],
  );

  const renderItem = ({ item }: { item: NotificationWorkoutRead }) => (
    <NotificationCard
      key={`notification-${item.id}`}
      {...item}
      navigateToUserDetails={navigateToUserDetails}
      navigateToWorkoutDetails={navigateToWorkoutDetails}
    />
  );

  const renderError = useCallback(
    (resetErrorBoundary: () => void) => (
      <View style={style.errorOrEmptyContainer}>
        <Text>알림을 불러올 수 없습니다!</Text>
        <Button onPress={() => resetErrorBoundary()}>다시 시도</Button>
      </View>
    ),
    [],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <Suspense
      fallback={
        <WorkoutPromiseLoader
          backgroundColor={theme.colors.background}
          foregroundColor={theme.colors.surfaceVariant}
        />
      }>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) =>
          renderError(resetErrorBoundary)
        }>
        <View style={style.container}>
          <FlatList
            data={notificationWorkoutList?.pages.flatMap(page => page.items)}
            keyExtractor={item => item.id}
            contentContainerStyle={style.notificationContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.1}
            initialNumToRender={5}
            renderItem={renderItem}
            ListFooterComponent={
              <ActivityIndicator
                animating={isFetchingNextPage}
                color={theme.colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={style.errorOrEmptyContainer}>
                <Text>알림이 없습니다!</Text>
              </View>
            }
          />
        </View>
      </ErrorBoundary>
    </Suspense>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationContainer: {
    flexGrow: 1,
  },
  errorOrEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
