import { Alert, Keyboard, Platform, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { postVOC } from '/api/api';
import { useAuthActions, useAuthValue } from '/hooks/context/useAuth';
type Props = {
  targetId?: string;
  type?: string;
};

function ReportBottomSheet({ targetId, type }: Props) {
  const theme = useTheme();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const iosSnapPoints = React.useMemo(() => ['75%'], []);
  const androidSnapPoints = React.useMemo(() => ['90%'], []);
  const [content, setContent] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const { isReportBottomSheetOpen: isBottomSheetOpen } = useAuthValue();
  const { setReportBottomSheetOpen: setIsBottomSheetOpen } = useAuthActions();

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

  useEffect(() => {
    if (isBottomSheetOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
    return () => {
      setIsBottomSheetOpen(false);
    };
  }, [isBottomSheetOpen, setIsBottomSheetOpen]);

  useEffect(() => {
    return () => {
      setReason('');
      setContent('');
    };
  }, []);

  const onCloseSheet = useCallback(async () => {
    setIsBottomSheetOpen(false);
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  }, [setIsBottomSheetOpen]);

  const onPressVOC = useCallback(async () => {
    if (!type) {
      return;
    }
    const _data: VOC = {
      reason,
      content,
      type: type,
      defendant: targetId,
    };
    try {
      await postVOC(_data);
      setIsBottomSheetOpen(false);
      setContent('');
      setReason('');
      Alert.alert('신고 접수가 완료되었습니다.');
    } catch (e) {
      Alert.alert('신고 접수에 실패했습니다.');
    } finally {
      onCloseSheet();
    }
  }, [content, onCloseSheet, reason, setIsBottomSheetOpen, targetId, type]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={Platform.OS === 'ios' ? iosSnapPoints : androidSnapPoints}
      backdropComponent={renderBackdrop}
      handleStyle={{ backgroundColor: theme.colors.background }}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      enablePanDownToClose={true}
      onClose={onCloseSheet}
      android_keyboardInputMode={'adjustResize'}>
      <BottomSheetView style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            신고 사유를 작성해주세요.
          </Text>
          <IconButton icon="close" size={24} onPress={onCloseSheet} />
        </View>
        <View>
          <BottomSheetTextInput
            value={reason}
            placeholder="ex) 욕설, 비방, 음란성, 사기, 기타"
            onChangeText={value => setReason(value)}
            returnKeyType="done"
            maxLength={30}
            multiline={true}
            style={[
              {
                backgroundColor: theme.colors.secondaryContainer,
                color: theme.colors.onSecondaryContainer,
              },
              styles.textInput,
            ]}
          />
          <View style={styles.textLimitBox}>
            <Text style={{ color: theme.colors.primary }}>{reason.length}</Text>
            <Text> / 30</Text>
          </View>
        </View>
        <View style={styles.titleBox}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            신고하실 내용을 입력해주세요.
          </Text>
        </View>
        <View>
          <BottomSheetTextInput
            value={content}
            placeholder="ex) ***님의 프로필 사진이 부적절합니다."
            onChangeText={value => setContent(value)}
            returnKeyType="done"
            maxLength={500}
            multiline={true}
            style={[
              {
                backgroundColor: theme.colors.secondaryContainer,
                color: theme.colors.onSecondaryContainer,
              },
              styles.textInput,
            ]}
          />
          <View style={styles.textLimitBox}>
            <Text style={{ color: theme.colors.primary }}>
              {content.length}
            </Text>
            <Text> / 500</Text>
          </View>
        </View>
      </BottomSheetView>
      <Button
        mode="contained"
        disabled={content.length === 0 || reason.length === 0}
        style={styles.buttonBox}
        onPress={onPressVOC}>
        신고하기
      </Button>
    </BottomSheet>
  );
}

export default ReportBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  textLimitBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: 12,
  },
  textInput: {
    alignSelf: 'stretch',
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    height: 100,
    borderRadius: 12,
    color: 'gray',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'left',
  },
  buttonBox: {
    margin: 12,
    borderRadius: 10,
  },
});
