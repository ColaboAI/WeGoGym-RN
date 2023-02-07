import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
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
  Chip,
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { getGymInfoFromApi } from '@/utils/util';
import { Gym } from '@/types';

const MAX_NUMBER = 5;
const MIN_NUMBER = 1;

type Mode = 'date' | 'time' | 'datetime' | undefined;

export default function PostingScreen() {
  const theme = useTheme();
  const [title, setTitle] = useState<string>('');
  const [titleFocus, setTitleFocus] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [contentFocus, setContentFocus] = useState<boolean>(false);
  const [number, setNumber] = useState<number>(3);
  // date picker
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [visible, setVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('date');
  // bottom sheet
  const [location, setLocation] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [searchFocus, setSearchFocus] = useState<boolean>(false);
  const [gymData, setGymData] = useState<Gym[] | null>(null);

  const hasTitleErrors = () => {
    return titleFocus && title.length === 0;
  };

  const hasContentErrors = () => {
    return contentFocus && content.length === 0;
  };

  const onPressPlus = () => {
    if (number < MAX_NUMBER) {
      setNumber(number + 1);
    }
  };

  const onPressMinus = () => {
    if (number > MIN_NUMBER) {
      setNumber(number - 1);
    }
  };

  const onPressDate = () => {
    setMode('date');
    setVisible(true);
  };

  const onPressTime = () => {
    setMode('time');
    setVisible(true);
  };

  const onConfirm = (selectedDate: React.SetStateAction<Date>) => {
    setVisible(false);
    if (mode === 'date') {
      setDate(selectedDate);
    } else if (mode === 'time') {
      setTime(selectedDate);
    }
  };

  const onCancel = () => {
    setVisible(false);
  };

  const isToday = () => {
    return (
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    );
  };

  const isSingleDigit = (num: number) => {
    return num < 10;
  };

  const onPressLocation = useCallback(async () => {
    bottomSheetRef.current?.expand();
    if (!gymData) {
      const res = await getData();
      setGymData(res);
    }
  }, [gymData]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['70%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSearchText('');
    }
    // console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  const getData = async () => {
    const apiData = await getGymInfoFromApi();
    return apiData;
  };

  const renderItem = useCallback(
    ({ item }: { item: Gym }) => (
      <TouchableOpacity>
        <View style={style.itemContainer}>
          <View style={style.item}>
            <Text variant="titleMedium">{item.name}</Text>
          </View>
          <View style={style.item}>
            <Chip style={style.chip} textStyle={{ fontSize: 10 }}>
              도로명
            </Chip>
            <View style={style.container}>
              <Text variant="bodySmall" numberOfLines={1} ellipsizeMode="tail">
                {item.address}
              </Text>
            </View>
          </View>
          <View style={style.item}>
            <Chip style={style.chip} textStyle={{ fontSize: 10 }}>
              우편번호
            </Chip>
            <Text variant="bodySmall">{item.zipCode}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <GestureHandlerRootView style={style.container}>
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
                  value={content}
                  onFocus={() => setContentFocus(true)}
                  onChangeText={value => setContent(value)}
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
                    {isToday() ? '오늘' : date.toLocaleDateString('ko-KR')}
                  </Text>
                </Button>
              </View>
              <View style={style.infoContainer}>
                <Text variant="titleMedium">⏰ 시간</Text>
                <Button onPress={onPressTime}>
                  <Text variant="bodyLarge">
                    {time.getHours()}시{' '}
                    {isSingleDigit(time.getMinutes())
                      ? '0' + time.getMinutes()
                      : time.getMinutes()}
                    분
                  </Text>
                </Button>
              </View>
              <View style={style.infoContainer}>
                <Text variant="titleMedium">📍 위치</Text>
                <Button onPress={onPressLocation}>
                  <Text
                    variant="bodyLarge"
                    style={{ color: theme.colors.onBackground }}>
                    {location ? location : '위치를 선택해주세요'}
                  </Text>
                </Button>
              </View>
            </ScrollView>
            <Button
              mode="contained-tonal"
              style={style.postingButton}
              onPress={() => {}}>
              작성 완료
            </Button>
            <DateTimePickerModal
              date={mode === 'date' ? date : time}
              isVisible={visible}
              display={
                Platform.OS === 'ios' && mode === 'date' ? 'inline' : 'spinner'
              }
              minuteInterval={10}
              mode={mode}
              onConfirm={onConfirm}
              onCancel={onCancel}
              locale="ko-KR"
              cancelTextIOS="취소"
              confirmTextIOS="확인"
              buttonTextColorIOS={theme.colors.primary}
            />
          </View>
        </TouchableWithoutFeedback>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          onChange={handleSheetChanges}
          handleStyle={{ backgroundColor: theme.colors.background }}
          backgroundStyle={{ backgroundColor: theme.colors.background }}
          enablePanDownToClose={true}
          android_keyboardInputMode={'adjustResize'}>
          <BottomSheetView>
            <BottomSheetTextInput
              value={searchText}
              placeholder="주변 헬스장을 검색하세요."
              onChangeText={value => setSearchText(value)}
              onFocus={() => setSearchFocus(true)}
              returnKeyType="search"
              style={[
                style.textInput,
                {
                  backgroundColor: theme.colors.secondaryContainer,
                  color: theme.colors.onBackground,
                },
              ]}
            />
          </BottomSheetView>
          {searchFocus && gymData !== null ? (
            <BottomSheetFlatList
              data={gymData}
              keyExtractor={(item: Gym) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              disableVirtualization={false}
              contentContainerStyle={style.contentContainer}
            />
          ) : (
            <Text>로딩중</Text>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
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
    color: 'white',
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
