import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  useTheme,
  Button,
  Text,
  TextInput,
  HelperText,
  IconButton,
} from 'react-native-paper';
import { useSnackBarActions } from '/hooks/context/useSnackbar';
import DateTimeModal, {
  DatePickerState,
} from 'components/organisms/Common/DateTimeModal';
import {
  getLocaleDate,
  getLocaleTime,
  getWorkoutPart,
  isToday,
} from 'utils/util';
import { HomeStackScreenProps } from 'navigators/types';
import { useWorkoutMutation } from '/hooks/queries/workout.queries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import GoogleMapSearch from '/components/organisms/Common/GoogleMapSearch';
import { ScrollView } from 'react-native-gesture-handler';

const MAX_NUMBER = 10;
const MIN_NUMBER = 2;

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
  const [isSelected, setIsSelected] = useState<WorkoutPart[]>([
    { id: 0, part: '가슴', select: false },
    { id: 1, part: '등', select: false },
    { id: 2, part: '어깨', select: false },
    { id: 3, part: '하체', select: false },
    { id: 4, part: '이두', select: false },
    { id: 5, part: '삼두', select: false },
    { id: 6, part: '팔', select: false },
    { id: 7, part: '상체', select: false },
    { id: 8, part: '유산소', select: false },
  ]);
  const { onShow } = useSnackBarActions();

  // const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const inset = useSafeAreaInsets();

  // date picker
  const [promiseDateState, setPromiseDateState] = useState<DatePickerState>(
    initialDatePickerState,
  );
  // const [recruitEndDateState, setRecruitEndDateState] =
  //   useState<DatePickerState>({
  //     visible: false,
  //     date: new Date(new Date().setDate(new Date().getDate() + 1)),
  //     mode: 'datetime',
  //   });

  // bottom sheet
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [promiseLocation, setPromiseLocation] =
    useState<PromiseLocation | null>(null);

  const hasTitleErrors = useCallback(() => {
    return titleFocus && title.length === 0;
  }, [titleFocus, title]);

  const hasContentErrors = useCallback(() => {
    return descriptionFocus && description.length === 0;
  }, [descriptionFocus, description]);

  const isNoPartSelected = () => {
    return isSelected.every(part => !part.select);
  };

  const onToggle = (id: number) => {
    const updatedSelected = isSelected.map(part =>
      part.id === id ? { ...part, select: !part.select } : part,
    );

    const selectedCount = updatedSelected.filter(part => part.select).length;

    if (selectedCount <= 3) {
      setIsSelected(updatedSelected);
    } else {
      onShow('최대 3개까지 선택할 수 있습니다.');
    }
  };

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
    const workoutPart = getWorkoutPart(isSelected);

    const data = {
      workoutPromise: {
        title,
        description,
        // isPrivate: isPrivate,
        maxParticipants: number,
        promise_time: promiseDateState.date,
        workoutPart,
        // recruit_end_time: recruitEndDateState.date,
      },
      promiseLocation,
    };
    workoutMutation.mutate(data);

    navigation.navigate('Home');
  }, [
    isSelected,
    title,
    description,
    number,
    promiseDateState.date,
    promiseLocation,
    workoutMutation,
    navigation,
  ]);

  return (
    <>
      <ScrollView>
        <View style={[style.container, { marginBottom: inset.bottom }]}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View style={style.container}>
              <View style={style.titleContainer}>
                <Text variant="titleMedium">제목</Text>
                <TextInput
                  mode="outlined"
                  placeholder="운동 약속 글 요약"
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
                  placeholder="운동 친구 모집 글 내용"
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
              {/* 모집 기한 */}
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
              {/* 공개 여부 */}
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
                    {isSelected
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
                {isSelected.map(button => {
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
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
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
      {!isBottomSheetOpen ? (
        <View style={{ marginBottom: inset.bottom }}>
          <Button
            mode="contained"
            style={style.postingButton}
            disabled={
              hasTitleErrors() ||
              hasContentErrors() ||
              !promiseLocation ||
              isNoPartSelected()
            }
            onPress={() => {
              onPressPosting();
            }}>
            작성 완료
          </Button>
        </View>
      ) : (
        <></>
      )}
    </>
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
  workoutPartContainer: {
    paddingHorizontal: 12,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
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
