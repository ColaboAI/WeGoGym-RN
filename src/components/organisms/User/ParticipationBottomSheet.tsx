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

type Props = {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workoutPromiseId: string;
  username: string;
};

const ParticipationBottomSheet = ({
  isBottomSheetOpen,
  setIsBottomSheetOpen,
  workoutPromiseId,
  username,
}: Props) => {
  const theme = useTheme();
  const workoutParticipantMutation = useWorkoutParticipantMutation();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const iosSnapPoints = React.useMemo(() => ['50%'], []);
  const androidSnapPoints = React.useMemo(() => ['90%'], []);
  const [requestMessage, setRequestMessage] = useState<string>('');

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
      setRequestMessage('');
    };
  }, [isBottomSheetOpen]);

  const onPressPostParticipation = useCallback(async () => {
    const _data = {
      workoutParticipant: {
        name: username,
        statusMessage: requestMessage,
      },
      workoutPromiseId: workoutPromiseId,
    };
    workoutParticipantMutation.mutate(_data);
  }, [workoutPromiseId, username, requestMessage, workoutParticipantMutation]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={Platform.OS === 'ios' ? iosSnapPoints : androidSnapPoints}
      backdropComponent={renderBackdrop}
      handleStyle={{ backgroundColor: theme.colors.background }}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      enablePanDownToClose={true}
      onClose={() => {
        Keyboard.dismiss();
        setIsBottomSheetOpen(false);
        bottomSheetRef.current?.close();
      }}
      android_keyboardInputMode={'adjustResize'}>
      <BottomSheetView style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            운동 친구에게 보낼 메세지를{'\n'}작성해주세요
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={() => {
              setIsBottomSheetOpen(false);
              bottomSheetRef.current?.close();
            }}
          />
        </View>
        <View>
          <BottomSheetTextInput
            value={requestMessage}
            placeholder="ex) 같이 운동해요!"
            onChangeText={value => setRequestMessage(value)}
            returnKeyType="done"
            maxLength={50}
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
              {requestMessage.length}
            </Text>
            <Text> / 50</Text>
          </View>
        </View>
      </BottomSheetView>
      <Button
        mode="contained"
        disabled={requestMessage.length === 0}
        style={styles.buttonBox}
        onPress={() => {
          onPressPostParticipation();
          setIsBottomSheetOpen(false);
          bottomSheetRef.current?.close();
          Keyboard.dismiss();
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
