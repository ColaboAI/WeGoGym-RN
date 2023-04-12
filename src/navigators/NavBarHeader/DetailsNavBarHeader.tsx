import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useAuthActions } from '/hooks/context/useAuth';
import { Route } from '@react-navigation/native';
type DetailParams = {
  workoutPromiseId?: string;
};
type Props = NativeStackHeaderProps & {
  route: Route<string, DetailParams | undefined>;
};
const DetailsNavBarHeader = ({ navigation, back, route }: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { setReportBottomSheetOpen, setReportTarget } = useAuthActions();
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

        <Menu
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
          <Menu.Item
            onPress={() => {
              setReportTarget('WorkoutPromise', route.params?.workoutPromiseId);
              setReportBottomSheetOpen(true);
              setMenuVisible(false);
            }}
            title="신고하기"
          />
        </Menu>
      </Appbar.Header>
    </>
  );
};

export default DetailsNavBarHeader;
