import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';

import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useWorkoutParticipantMutation } from '/hooks/queries/workout.queries';
import { useGetMyInfoQuery } from '/hooks/queries/user.queries';

type Props = {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workoutPromiseId: string;
};
const ParticipationBottomSheet = (props: Props) => {
  const theme = useTheme();
  const workoutParticipantMutation = useWorkoutParticipantMutation();
  const { data } = useGetMyInfoQuery();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const iosSnapPoints = React.useMemo(() => ['50%'], []);
  const androidSnapPoints = React.useMemo(() => ['90%'], []);
  const [requestText, setRequestText] = useState<string>('');

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
    if (props.isBottomSheetOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
    return () => {
      setRequestText('');
    };
  }, [props.isBottomSheetOpen]);

  const onPressPostParticipation = useCallback(async () => {
    const _data = {
      workoutParticipant: {
        name: data?.username as string,
        statusMessage: requestText,
        userId: data?._id as string,
      },
      workoutPromiseId: props.workoutPromiseId,
    };
    workoutParticipantMutation.mutate(_data);
  }, [
    data?._id,
    data?.username,
    props.workoutPromiseId,
    requestText,
    workoutParticipantMutation,
  ]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={Platform.OS === 'ios' ? iosSnapPoints : androidSnapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      onClose={() => {
        props.setIsBottomSheetOpen(false);
      }}
      android_keyboardInputMode={'adjustResize'}>
      <BottomSheetView style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>
            운동 파트너에게 보낼 메세지를{'\n'}작성해주세요
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={() => {
              props.setIsBottomSheetOpen(false);
            }}
          />
        </View>
        <View>
          <BottomSheetTextInput
            value={requestText}
            placeholder="ex) 같이 운동해요!"
            onChangeText={value => setRequestText(value)}
            returnKeyType="done"
            maxLength={50}
            multiline={true}
            style={[
              styles.textInput,
              {
                backgroundColor: theme.colors.secondaryContainer,
                color: theme.colors.onBackground,
              },
            ]}
          />
          <View style={styles.textLimitBox}>
            <Text style={{ color: theme.colors.primary }}>
              {requestText.length}
            </Text>
            <Text> / 50</Text>
          </View>
        </View>
      </BottomSheetView>
      <Button
        mode="contained"
        style={styles.buttonBox}
        onPress={() => {
          props.setIsBottomSheetOpen(false);
          Keyboard.dismiss();
          onPressPostParticipation();
        }}>
        참여하기
      </Button>
    </BottomSheet>
  );
};

export default ParticipationBottomSheet;

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
