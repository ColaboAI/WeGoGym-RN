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
} from 'react-native-paper';
import { usePutWorkoutMutation } from '/hooks/queries/workout.queries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getLocaleDate,
  getLocaleTime,
  getWorkoutPart,
  isToday,
} from '/utils/util';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSnackBarActions } from '/hooks/context/useSnackbar';
import GoogleMapSearch from '/components/organisms/Common/GoogleMapSearch';

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
  // const [isPrivate, setIsPrivate] = useState<boolean>(promiseInfo.isPrivate);

  const workoutPartList = [
    { id: 0, part: '가슴', select: false },
    { id: 1, part: '등', select: false },
    { id: 2, part: '어깨', select: false },
    { id: 3, part: '하체', select: false },
    { id: 4, part: '이두', select: false },
    { id: 5, part: '삼두', select: false },
    { id: 6, part: '팔', select: false },
    { id: 7, part: '상체', select: false },
    { id: 8, part: '유산소', select: false },
  ];

  const { onShow } = useSnackBarActions();

  const initWorkoutPart = (parts: string[]) => {
    const newWorkoutPartList = workoutPartList.map(item => {
      if (parts.includes(item.part)) {
        return { ...item, select: true };
      } else {
        return { ...item, select: false };
      }
    });
    return newWorkoutPartList;
  };

  const [myWorkoutPartState, setMyWorkoutPartState] = useState(
    initWorkoutPart(
      promiseInfo.workoutPart ? promiseInfo.workoutPart.split(',') : [],
    ),
  );

  const isNoPartSelected = () => {
    return myWorkoutPartState.every(part => !part.select);
  };

  const onToggle = (id: number) => {
    const updatedSelected = myWorkoutPartState.map(part =>
      part.id === id ? { ...part, select: !part.select } : part,
    );

    const selectedCount = updatedSelected.filter(part => part.select).length;

    if (selectedCount <= 3) {
      setMyWorkoutPartState(updatedSelected);
    } else {
      onShow('최대 3개까지 선택할 수 있습니다.');
    }
  };

  const initialDatePickerState: DatePickerState = {
    date: new Date(promiseInfo.promiseTime),
    mode: 'date',
    visible: false,
  };

  const [promiseDateState, setPromiseDateState] = useState<DatePickerState>(
    initialDatePickerState,
  );

  // const [recruitEndDateState, setRecruitEndDateState] =
  //   useState<DatePickerState>({
  //     date: new Date(promiseInfo.recruitEndTime),
  //     mode: 'datetime',
  //     visible: false,
  //   });

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [promiseLocation, setPromiseLocation] =
    useState<PromiseLocation | null>(promiseInfo.promiseLocation);

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
    const workoutPart = getWorkoutPart(myWorkoutPartState);

    const data = {
      workoutPromiseId: promiseInfo.id,
      workoutPromise: {
        title,
        description,
        // isPrivate,
        maxParticipants,
        promise_time: promiseDateState.date,
        workout_part: workoutPart,
        // recruit_end_time: recruitEndDateState.date,
      },
      promiseLocation,
    };
    updateWorkoutMutation.mutate(data);
    navigation.goBack();
  }, [
    promiseInfo.id,
    title,
    description,
    maxParticipants,
    promiseDateState.date,
    myWorkoutPartState,
    promiseLocation,
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
              <View style={style.infoBox}>
                <Icon
                  name="people-outline"
                  size={20}
                  color={theme.colors.onBackground}
                  style={style.icon}
                />
                <Text variant="titleMedium">인원</Text>
              </View>
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
              <View style={style.infoBox}>
                <Icon
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.onBackground}
                  style={style.icon}
                />
                <Text variant="titleMedium">약속 날짜</Text>
              </View>
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
              <View style={style.infoBox}>
                <Icon
                  name="alarm-outline"
                  size={20}
                  color={theme.colors.onBackground}
                  style={style.icon}
                />
                <Text variant="titleMedium">약속 시간</Text>
              </View>
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
            {/* <View style={style.infoContainer}>
              <View style={style.infoBox}>
                <Icon
                  name="timer-outline"
                  size={20}
                  color={theme.colors.onBackground}
                  style={style.icon}
                />
                <Text variant="titleMedium">모집 기한</Text>
              </View>
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
            </View> */}
            <View style={style.infoContainer}>
              <View style={style.infoBox}>
                <Icon
                  name="location-outline"
                  size={20}
                  color={theme.colors.onBackground}
                  style={style.icon}
                />
                <Text variant="titleMedium">위치</Text>
              </View>
              <Button onPress={onPressLocation}>
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onBackground }}>
                  {promiseLocation
                    ? promiseLocation.placeName
                    : '위치를 선택해주세요'}
                </Text>
              </Button>
            </View>
            {/* <View style={style.infoContainer}>
              <View style={style.infoBox}>
                <Icon
                  name={isPrivate ? 'lock-closed-outline' : 'lock-open-outline'}
                  size={20}
                  color={theme.colors.onBackground}
                  style={style.icon}
                />
                <Text variant="titleMedium">비공개 여부</Text>
              </View>
              <Switch
                value={isPrivate}
                onValueChange={value => setIsPrivate(value)}
              />
            </View> */}
            <View style={style.infoContainer}>
              <View style={style.infoBox}>
                <Icon
                  name="barbell-outline"
                  size={20}
                  color={theme.colors.onBackground}
                  style={style.icon}
                />
                <Text variant="titleMedium">운동 부위</Text>
              </View>
              <Button>
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onBackground }}>
                  {myWorkoutPartState
                    .filter(item => item.select)
                    .map(item => item.part)
                    .join(', ') || '운동 부위를 선택해주세요'}
                </Text>
              </Button>
            </View>
            <ScrollView
              style={style.horizontalButtonContainer}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {myWorkoutPartState.map(button => {
                return (
                  <Button
                    key={`select-${button.id}`}
                    style={[style.button]}
                    mode={button.select ? 'contained' : 'elevated'}
                    onPress={() => {
                      onToggle(button.id);
                    }}>
                    {button.part}
                  </Button>
                );
              })}
            </ScrollView>
          </ScrollView>
          <Button
            mode="contained-tonal"
            style={style.postingButton}
            disabled={
              hasTitleErrors() ||
              hasContentErrors() ||
              !promiseLocation ||
              isNoPartSelected()
            }
            onPress={() => {
              onPressEdit();
            }}>
            수정 완료
          </Button>
        </View>
      </TouchableWithoutFeedback>
      <DateTimeModal state={promiseDateState} setState={setPromiseDateState} />
      {/* <DateTimeModal
        state={recruitEndDateState}
        setState={setRecruitEndDateState}
      /> */}
      <GoogleMapSearch
        isBottomSheetOpen={isBottomSheetOpen}
        setIsBottomSheetOpen={setIsBottomSheetOpen}
        promiseLocation={promiseLocation}
        setPromiseLocation={setPromiseLocation}
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
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
  horizontalButtonContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingBottom: 12,
  },
  button: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  chip: {
    alignItems: 'center',
    marginRight: 4,
    width: 75,
    height: 30,
  },
  icon: {
    marginRight: 6,
  },
});
