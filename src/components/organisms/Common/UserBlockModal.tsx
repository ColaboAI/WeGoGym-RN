import { Platform, StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
import { Button, Caption, Subheading, useTheme } from 'react-native-paper';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { postBlockUser } from '/api/api';
import { useSnackBarActions } from '/hooks/context/useSnackbar';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  userId?: string;
};
//

const UserBlockModal = (props: Props) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const iosSnapPoints = React.useMemo(() => ['75%'], []);
  const androidSnapPoints = React.useMemo(() => ['90%'], []);
  const { onShow } = useSnackBarActions();
  const closeModal = useCallback(() => {
    props.setIsModalOpen(false);
    bottomSheetRef.current?.close();
  }, [props]);

  const renderBackdrop = useCallback(
    (
      backdropProps: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
    ) => (
      <BottomSheetBackdrop
        {...backdropProps}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  const onPressPost = useCallback(async () => {
    try {
      if (!props.userId) return;
      await postBlockUser(props.userId);
      onShow('차단되었습니다.', 'success');
      queryClient.invalidateQueries(['chatList']);
      closeModal();
    } catch (error) {
      console.log(error);
      onShow('차단에 실패했습니다.', 'error');
    }
  }, [props.userId, onShow, queryClient, closeModal]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={props.isModalOpen ? 0 : -1}
      snapPoints={Platform.OS === 'ios' ? iosSnapPoints : androidSnapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      onClose={() => {
        props.setIsModalOpen(false);
        bottomSheetRef.current?.close();
      }}
      style={styles.bottomSheet}
      backdropComponent={renderBackdrop}>
      <BottomSheetView style={styles.container}>
        <View style={styles.description}>
          <Subheading>사용자를 차단하시겠습니까?</Subheading>
          <Caption>상대방의 새로운 메세지를 차단합니다.</Caption>
          <Caption>짐메이트 추천 알고리즘에서 제외합니다.</Caption>
        </View>
        <View style={styles.rowContainer}>
          <Button
            mode="contained"
            textColor={theme.colors.onSurfaceVariant}
            buttonColor={theme.colors.surfaceVariant}
            style={styles.button}
            onPress={closeModal}>
            취소
          </Button>
          <Button mode="contained" style={styles.button} onPress={onPressPost}>
            차단
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default UserBlockModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  rowContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 50,
  },
  button: {
    marginHorizontal: 10,
    flexShrink: 1,
  },
});
