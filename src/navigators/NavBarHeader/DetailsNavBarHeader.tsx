import React, { useCallback, useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useAuthActions } from '/hooks/context/useAuth';
import { Route } from '@react-navigation/native';
import {
  useGetWorkoutByIdQuery,
  useWorkoutDeleteMutation,
} from '/hooks/queries/workout.queries';
import { useGetUserInfoQuery } from '/hooks/queries/user.queries';
import { Alert } from 'react-native';
import { isAdmin } from '/utils/util';

type DetailParams = {
  workoutPromiseId?: string;
};

type Props = NativeStackHeaderProps & {
  route: Route<string, DetailParams | undefined>;
};

const DetailsNavBarHeader = ({ navigation, back, route }: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { setReportBottomSheetOpen, setReportTarget } = useAuthActions();
  const query = useGetWorkoutByIdQuery(route.params?.workoutPromiseId);
  const { data: myInfo } = useGetUserInfoQuery('me');
  const deleteWorkoutMutation = useWorkoutDeleteMutation();

  const navigationToPromiseEdit = useCallback(
    (workoutInfo: WorkoutPromiseRead) => {
      navigation.navigate('PromiseEdit', { workoutInfo });
    },
    [navigation],
  );

  const onDeleteWorkout = () => {
    Alert.alert('게시글을 삭제하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          deleteWorkoutMutation.mutate(route.params?.workoutPromiseId);
          navigation.goBack();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <>
      <Appbar.Header>
        {back ? (
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
        ) : null}
        <Appbar.Content title="" />
        {query.data && myInfo ? (
          <Menu
            style={{
              paddingTop: 40,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Appbar.Action
                icon="ellipsis-vertical"
                onPress={() => {
                  setMenuVisible(true);
                }}
              />
            }>
            {isAdmin(myInfo.id, query.data.adminUserId) ? (
              <>
                <Menu.Item
                  leadingIcon={'create-outline'}
                  dense
                  onPress={() => {
                    navigationToPromiseEdit(query.data);
                    setMenuVisible(false);
                  }}
                  title="수정"
                />
                <Menu.Item
                  leadingIcon={'trash-outline'}
                  dense
                  onPress={() => {
                    onDeleteWorkout();
                    setMenuVisible(false);
                  }}
                  title="삭제"
                />
              </>
            ) : (
              <Menu.Item
                dense
                onPress={() => {
                  setReportTarget(
                    'WorkoutPromise',
                    route.params?.workoutPromiseId,
                  );
                  setReportBottomSheetOpen(true);
                  setMenuVisible(false);
                }}
                title="신고"
              />
            )}
          </Menu>
        ) : null}
      </Appbar.Header>
    </>
  );
};

export default DetailsNavBarHeader;
