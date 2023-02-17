import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import {
  useTheme,
  Button,
  Text,
  TextInput,
  HelperText,
  IconButton,
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { getLocaleDate, getLocaleTime, isToday } from 'utils/util';
import { postWorkoutPromise } from 'api/api';
import { HomeStackScreenProps } from 'navigators/types';
import GymBottomSheet from '/components/organisms/User/GymBottomSheet';

const MAX_NUMBER = 5;
const MIN_NUMBER = 1;

type Mode = 'date' | 'time' | 'datetime' | undefined;
type HomeScreenProps = HomeStackScreenProps<'Posting'>;

export default function PostingScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();
  const [title, setTitle] = useState<string>('');
  const [titleFocus, setTitleFocus] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [descriptionFocus, setDescriptionFocus] = useState<boolean>(false);
  const [number, setNumber] = useState<number>(3);
  // date picker
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [visible, setVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('date');
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
    if (number < MAX_NUMBER) {
      setNumber(number + 1);
    }
  }, [number]);

  const onPressMinus = useCallback(() => {
    if (number > MIN_NUMBER) {
      setNumber(number - 1);
    }
  }, [number]);

  const onPressDate = useCallback(() => {
    setMode('date');
    setVisible(true);
  }, []);

  const onPressTime = useCallback(() => {
    setMode('time');
    setVisible(true);
  }, []);

  const onConfirm = useCallback(
    (selectedDate: React.SetStateAction<Date>) => {
      setVisible(false);
      if (mode === 'date') {
        setDate(selectedDate);
      } else if (mode === 'time') {
        setTime(selectedDate);
      }
    },
    [mode],
  );

  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const onPressLocation = useCallback(async () => {
    setIsBottomSheetOpen(true);
  }, []);

  return (
    <View style={style.container}>
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
            <View style={style.infoContainer}>
              <Text variant="titleMedium">🗓️ 날짜</Text>
              <Button onPress={onPressDate}>
                <Text variant="bodyLarge">
                  {isToday(date) ? '오늘' : getLocaleDate(date)}
                </Text>
              </Button>
            </View>
            <View style={style.infoContainer}>
              <Text variant="titleMedium">⏰ 시간</Text>
              <Button onPress={onPressTime}>
                <Text variant="bodyLarge">{getLocaleTime(time)}</Text>
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
          </ScrollView>
          <Button
            mode="contained-tonal"
            style={style.postingButton}
            disabled={hasTitleErrors() || hasContentErrors() || !gymInfo}
            onPress={() => {
              postWorkoutPromise({
                title: title,
                description: description,
                location: gymInfo?.address || '',
                date: date,
                time: time,
                limitedNumberOfPeople: number,
              });
              navigation.navigate('Home');
            }}>
            작성 완료
          </Button>
          <DateTimePickerModal
            date={mode === 'date' ? date : time}
            isVisible={visible}
            display={
              Platform.OS === 'ios' && mode === 'date' ? 'inline' : 'spinner'
            }
            isDarkModeEnabled={theme.dark}
            minuteInterval={10}
            mode={mode}
            onConfirm={onConfirm}
            onCancel={onCancel}
            cancelTextIOS="취소"
            confirmTextIOS="확인"
            buttonTextColorIOS={theme.colors.primary}
          />
        </View>
      </TouchableWithoutFeedback>
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
    alignSelf: 'stretch',
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    color: 'gray',
    textAlign: 'left',
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
