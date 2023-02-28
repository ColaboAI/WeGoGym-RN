import React, { Suspense } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import FriendListLoader from 'components/molecules/Home/FriendListLoader';
import FriendProfileCard from 'components/molecules/Home/FriendProfileCard';
import { useGetRecommendedMatesQuery } from '/hooks/queries/user.queries';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  navigateToUserDetails: (id: string) => void;
};

export default function GymMateRecommendation({
  navigateToUserDetails,
}: Props) {
  const theme = useTheme();
  //   use query to get friend list
  const { data: friendList } = useGetRecommendedMatesQuery();
  return (
    <>
      <View style={styles.title}>
        <Text
          variant="titleLarge"
          style={[
            styles.font,
            {
              color: theme.colors.primary,
            },
          ]}>
          👍🏻 추천 짐메이트
        </Text>
      </View>
      <Suspense fallback={<FriendListLoader />}>
        <ErrorBoundary fallback={<Text>에러가 발생했습니다.</Text>}>
          <View style={styles.friendListContainer}>
            {friendList?.map(friend => (
              <FriendProfileCard
                key={`User-Reco-${friend.id}`}
                id={friend.id}
                profilePic={friend.profilePic}
                username={friend.username}
                navigateToUserDetails={navigateToUserDetails}
              />
            ))}
          </View>
        </ErrorBoundary>
      </Suspense>
      <View style={styles.title}>
        <Text
          variant="titleLarge"
          style={{
            color: theme.colors.primary,
            fontSize: 20,
            fontWeight: '600',
          }}>
          💪🏻 같이 운동해요!
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  font: {
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    padding: 12,
  },
  friendListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 6,
  },
});
