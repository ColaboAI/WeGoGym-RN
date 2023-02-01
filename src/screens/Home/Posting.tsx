import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
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
} from 'react-native-paper';
import React, { useState } from 'react';

export default function PostingScreen() {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [titleFocus, setTitleFocus] = useState(false);
  const [contentFocus, setContentFocus] = useState(false);
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [number, setNumber] = useState(3);
  const [maxNumber, setMaxNumber] = useState(5);
  const [minNumber, setMinNumber] = useState(2);
  const [age, setAge] = useState('');

  const hasTitleErrors = () => {
    return titleFocus && title.length === 0;
  };

  const hasContentErrors = () => {
    return contentFocus && content.length === 0;
  };

  const onPressPlus = () => {
    if (number < maxNumber) {
      setNumber(number + 1);
    }
  };

  const onPressMinus = () => {
    if (number > minNumber) {
      setNumber(number - 1);
    }
  };

  return (
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
          <View style={style.contentContainer}>
            <Text variant="titleMedium">내용</Text>
            <TextInput
              mode="outlined"
              multiline={true}
              numberOfLines={5}
              placeholder="날짜, 시간, 장소 등 자세한 내용을 입력해주세요!"
              error={hasContentErrors()}
              value={content}
              onFocus={() => setContentFocus(true)}
              onChangeText={value => setContent(value)}
            />
          </View>
          <HelperText type="error" visible={hasContentErrors()}>
            ⚠️ 운동 모집 글의 내용을 입력해주세요!
          </HelperText>
          <View style={style.numberContainer}>
            <Text variant="titleMedium">👥 인원</Text>
            <View style={style.numberButtonContainer}>
              <IconButton
                icon="remove-circle-outline"
                disabled={number === minNumber}
                iconColor={theme.colors.primary}
                size={20}
                onPress={onPressMinus}
              />
              <Text variant="bodyMedium">{number}명</Text>
              <IconButton
                icon="add-circle-outline"
                disabled={number === maxNumber}
                iconColor={theme.colors.primary}
                size={20}
                onPress={onPressPlus}
              />
            </View>
          </View>
          <View style={style.dateContainer}>
            <Text variant="titleMedium">🗓️ 날짜</Text>
            <View style={style.numberButtonContainer}>
              <IconButton
                icon="remove-circle-outline"
                disabled={number === minNumber}
                iconColor={theme.colors.primary}
                size={20}
                onPress={onPressMinus}
              />
              <Text variant="bodyMedium">{number}명</Text>
              <IconButton
                icon="add-circle-outline"
                disabled={number === maxNumber}
                iconColor={theme.colors.primary}
                size={20}
                onPress={onPressPlus}
              />
            </View>
          </View>
        </ScrollView>
        <View style={style.postingButtonContainer} />
        <Button
          mode="contained-tonal"
          style={style.postingButton}
          onPress={() => {}}>
          작성 완료
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 12,
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
  numberContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  postingButton: {
    borderRadius: 0,
  },
});
