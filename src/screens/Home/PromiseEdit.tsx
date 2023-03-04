import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { HomeStackScreenProps } from '/navigators/types';
import DateTimeModal, {
  DatePickerState,
} from '/components/organisms/Common/DateTimeModal';
import {
  TextInput,
  Text,
  useTheme,
  HelperText,
  IconButton,
  Button,
  Switch,
} from 'react-native-paper';
import { usePutWorkoutMutation } from '/hooks/queries/workout.queries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLocaleDate, getLocaleTime, isToday } from '/utils/util';
import GymBottomSheet from '/components/organisms/User/GymBottomSheet';

const MAX_NUMBER = 5;
const MIN_NUMBER = 1;

type HomeScreenProps = HomeStackScreenProps<'PromiseEdit'>;

export default function PromiseEditScreen({
  navigation,
  route,
}: HomeScreenProps) {
  const theme = useTheme();
  const inset = useSafeAreaInsets();
  const promiseInfo = route.params.workoutInfo;
  const updateWorkoutMutation = usePutWorkoutMutation();
  const [title, setTitle] = useState<string>(promiseInfo.title);
  const [titleFocus, setTitleFocus] = useState<boolean>(false);

  const [description, setDescription] = useState<string>(
    promiseInfo.description,
  );
  const [descriptionFocus, setDescriptionFocus] = useState<boolean>(false);

  const [maxParticipants, setMaxParticipants] = useState<number>(
    promiseInfo.maxParticipants,
  );
  const [isPrivate, setIsPrivate] = useState<boolean>(promiseInfo.isPrivate);

  const initialDatePickerState: DatePickerState = {
    date: new Date(promiseInfo.promiseTime),
    mode: 'date',
    visible: false,
  };

  const [promiseDateState, setPromiseDateState] = useState<DatePickerState>(
    initialDatePickerState,
  );

  const [recruitEndDateState, setRecruitEndDateState] =
    useState<DatePickerState>({
      date: new Date(promiseInfo.recruitEndTime),
      mode: 'datetime',
      visible: false,
    });

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [gymInfo, setGymInfo] = useState<Gym | null>(promiseInfo.gymInfo);

  const hasTitleErrors = useCallback(() => {
    return titleFocus && title.length === 0;
  }, [titleFocus, title]);

  const hasContentErrors = useCallback(() => {
    return descriptionFocus && description.length === 0;
  }, [descriptionFocus, description]);

  const onPressPlus = useCallback(() => {
    setMaxParticipants(prev => {
      if (prev < MAX_NUMBER) {
        return prev + 1;
      } else {
        return prev;
      }
    });
  }, []);

  const onPressMinus = useCallback(() => {
    setMaxParticipants(prev => {
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

  const onPressEdit = useCallback(async () => {
    const data = {
      workoutPromiseId: promiseInfo.id,
      workoutPromise: {
        title,
        description,
        isPrivate,
        maxParticipants,
        promise_time: promiseDateState.date,
        recruit_end_time: recruitEndDateState.date,
      },
      gymInfo,
    };
    updateWorkoutMutation.mutate(data);
    navigation.goBack();
  }, [
    promiseInfo.id,
    title,
    description,
    isPrivate,
    maxParticipants,
    promiseDateState.date,
    recruitEndDateState.date,
    gymInfo,
    updateWorkoutMutation,
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
                  disabled={maxParticipants === MIN_NUMBER}
                  iconColor={theme.colors.primary}
                  size={20}
                  onPress={onPressMinus}
                />
                <Text variant="bodyLarge">{maxParticipants}명</Text>
                <IconButton
                  icon="add-circle-outline"
                  disabled={maxParticipants === MAX_NUMBER}
                  iconColor={theme.colors.primary}
                  size={20}
                  onPress={onPressPlus}
                />
              </View>
            </View>
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
              onPressEdit();
            }}>
            수정 완료
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
