import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from 'react-native';
import {
  useTheme,
  Button,
  Text,
  TextInput,
  HelperText,
  IconButton,
  Switch,
} from 'react-native-paper';

import DateTimeModal, {
  DatePickerState,
} from 'components/organisms/Common/DateTimeModal';
import { getLocaleDate, getLocaleTime, isToday } from 'utils/util';
import { HomeStackScreenProps } from 'navigators/types';
import GymBottomSheet from '/components/organisms/User/GymBottomSheet';
import { useWorkoutMutation } from '/hooks/queries/workout.queries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MAX_NUMBER = 5;
const MIN_NUMBER = 1;

type HomeScreenProps = HomeStackScreenProps<'Posting'>;

export default function PostingScreen({ navigation }: HomeScreenProps) {
  const workoutMutation = useWorkoutMutation();
  const initialDatePickerState: DatePickerState = {
    visible: false,
    mode: 'date',
    date: new Date(),
  };
  const theme = useTheme();
  const [title, setTitle] = useState<string>('');
  const [titleFocus, setTitleFocus] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [descriptionFocus, setDescriptionFocus] = useState<boolean>(false);
  const [number, setNumber] = useState<number>(3);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const inset = useSafeAreaInsets();

  // date picker
  const [promiseDateState, setPromiseDateState] = useState<DatePickerState>(
    initialDatePickerState,
  );
  const [recruitEndDateState, setRecruitEndDateState] =
    useState<DatePickerState>({
      visible: false,
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      mode: 'datetime',
    });

  // bottom sheet
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [gymInfo, setGymInfo] = useState<Gym | null>(null);

  const hasTitleErrors = useCallback(() => {
    return titleFocus && title.length === 0;
  }, [titleFocus, title]);

  const hasContentErrors = useCallback(() => {
    return descriptionFocus && description.length === 0;
  }, [descriptionFocus, description]);

  const onPressPlus = useCallback(() => {
    setNumber(prev => {
      if (prev < MAX_NUMBER) {
        return prev + 1;
      } else {
        return prev;
      }
    });
  }, []);

  const onPressMinus = useCallback(() => {
    setNumber(prev => {
      if (prev > MIN_NUMBER) {
        return prev - 1;
      } else {
        return prev;
      }
    });
  }, []);

  const onPressLocation = useCallback(async () => {
    setIsBottomSheetOpen(true);
  }, []);

  const onPressPosting = useCallback(async () => {
    const data = {
      workoutPromise: {
        title,
        description,
        isPrivate: isPrivate,
        maxParticipants: number,
        promise_time: promiseDateState.date,
        recruit_end_time: recruitEndDateState.date,
      },
      gymInfo,
    };
    workoutMutation.mutate(data);

    navigation.navigate('Home');
  }, [
    title,
    description,
    isPrivate,
    number,
    promiseDateState.date,
    recruitEndDateState.date,
    gymInfo,
    workoutMutation,
    navigation,
  ]);
  return (
    <View style={[style.container, { marginBottom: inset.bottom }]}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={style.container}>
          <ScrollView>
            <View style={style.titleContainer}>
              <Text variant="titleMedium">제목</Text>
              <TextInput
                mode="outlined"
                placeholder="운동 모집 글 요약"
                error={hasTitleErrors()}
                value={title}
                onFocus={() => setTitleFocus(true)}
                onChangeText={value => setTitle(value)}
              />
            </View>
            <HelperText type="error" visible={hasTitleErrors()}>
              ⚠️ 운동 모집 글의 제목을 입력해주세요!
            </HelperText>
            <View style={style.descriptionContainer}>
              <Text variant="titleMedium">내용</Text>
              <TextInput
                mode="outlined"
                multiline={true}
                numberOfLines={5}
                placeholder="운동 파트너 모집 글 내용"
                error={hasContentErrors()}
                value={description}
                style={style.textInput}
                onFocus={() => setDescriptionFocus(true)}
                onChangeText={value => setDescription(value)}
              />
            </View>
            <HelperText type="error" visible={hasContentErrors()}>
              ⚠️ 운동 모집 글의 내용을 입력해주세요!
            </HelperText>
            <View style={style.infoContainer}>
              <Text variant="titleMedium">👥 인원</Text>
              <View style={style.numberButtonContainer}>
                <IconButton
                  icon="remove-circle-outline"
                  disabled={number === MIN_NUMBER}
                  iconColor={theme.colors.primary}
                  size={20}
                  onPress={onPressMinus}
                />
                <Text variant="bodyLarge">{number}명</Text>
                <IconButton
                  icon="add-circle-outline"
                  disabled={number === MAX_NUMBER}
                  iconColor={theme.colors.primary}
                  size={20}
                  onPress={onPressPlus}
                />
              </View>
            </View>
            {/* 운동 날짜 */}
            <View style={style.infoContainer}>
              <Text variant="titleMedium">🗓️ 약속 날짜</Text>
              <Button
                onPress={() => {
                  setPromiseDateState(prev => ({
                    ...prev,
                    visible: true,
                    mode: 'date',
                  }));
                }}>
                <Text variant="bodyLarge">
                  {isToday(promiseDateState.date)
                    ? '오늘'
                    : getLocaleDate(promiseDateState.date)}
                </Text>
              </Button>
            </View>
            <View style={style.infoContainer}>
              <Text variant="titleMedium">⏰ 약속 시간</Text>
              <Button
                onPress={() => {
                  setPromiseDateState(prev => ({
                    ...prev,
                    visible: true,
                    mode: 'time',
                  }));
                }}>
                <Text variant="bodyLarge">
                  {getLocaleTime(promiseDateState.date)}
                </Text>
              </Button>
            </View>
            {/* 모집 기한 */}
            <View style={style.infoContainer}>
              <Text variant="titleMedium">🎯 모집 기한</Text>
              <Button
                onPress={() => {
                  setRecruitEndDateState(prev => ({
                    ...prev,
                    visible: true,
                  }));
                }}>
                <Text variant="bodyLarge">
                  {isToday(recruitEndDateState.date)
                    ? '오늘'
                    : getLocaleDate(recruitEndDateState.date) +
                      ' ' +
                      getLocaleTime(recruitEndDateState.date)}
                </Text>
              </Button>
            </View>

            <View style={style.infoContainer}>
              <Text variant="titleMedium">📍 위치</Text>
              <Button onPress={onPressLocation}>
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onBackground }}>
                  {gymInfo ? gymInfo.name : '위치를 선택해주세요'}
                </Text>
              </Button>
            </View>
            {/* 공개 여부 */}
            <View style={style.infoContainer}>
              <Text variant="titleMedium">🔒 비공개 여부</Text>
              <Switch
                value={isPrivate}
                onValueChange={value => setIsPrivate(value)}
              />
            </View>
          </ScrollView>
          <Button
            mode="contained-tonal"
            style={style.postingButton}
            disabled={hasTitleErrors() || hasContentErrors() || !gymInfo}
            onPress={() => {
              onPressPosting();
            }}>
            작성 완료
          </Button>
        </View>
      </TouchableWithoutFeedback>
      <DateTimeModal state={promiseDateState} setState={setPromiseDateState} />
      <DateTimeModal
        state={recruitEndDateState}
        setState={setRecruitEndDateState}
      />
      <GymBottomSheet
        isBottomSheetOpen={isBottomSheetOpen}
        setIsBottomSheetOpen={setIsBottomSheetOpen}
        gymInfo={gymInfo}
        setGymInfo={setGymInfo}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 12,
  },
  descriptionContainer: {
    paddingHorizontal: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postingButton: {
    borderRadius: 0,
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
  textInput: {
    lineHeight: 24,
  },
  itemContainer: {
    flex: 1,
    width: '100%',
    marginHorizontal: 4,
    marginVertical: 8,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  chip: {
    alignItems: 'center',
    marginRight: 4,
    width: 75,
    height: 30,
  },
});
