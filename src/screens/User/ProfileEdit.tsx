import { StyleSheet, View, Platform } from 'react-native';
import {
  Text,
  Card,
  List,
  Button,
  Chip,
  TextInput,
  useTheme,
} from 'react-native-paper';
import React, { useCallback, useState } from 'react';
import { UserStackScreenProps } from '/navigators/types';
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';

import { ScrollView } from 'react-native-gesture-handler';
import InfoEditCardNumeric from '../../components/molecules/User/InfoEditCardNumeric';
import GymBottomSheet from '/components/organisms/User/GymBottomSheet';
import { usePutMyInfoMutation } from '/hooks/queries/user.queries';
import StringMenu from '/components/molecules/User/StringMenu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import { getAge } from '/utils/util';
import { ActivityAreaPicker } from '/components/organisms/Common/ActivityAreaPicker';

// TODO: bio
type Props = UserStackScreenProps<'ProfileEdit'>;
// Platform.OS === 'android' ? selectedImage.uri : selectedImage.uri.replace('file://', '')
export default function ProfileEdit({ navigation, route }: Props) {
  const theme = useTheme();
  const inset = useSafeAreaInsets();
  const myInfo = route.params.myInfo;

  const [gymInfo, setGymInfo] = useState(myInfo.gymInfo);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [myInfoState, setMyInfoState] = useState(myInfo);
  const workoutGoalList = [
    { id: 0, goal: '💪🏻 근성장', select: false },
    { id: 1, goal: '🚴🏻 체력 증진', select: false },
    { id: 2, goal: '🏋🏻‍♂️ 벌크업', select: false },
    { id: 3, goal: '🏃🏻 다이어트', select: false },
    { id: 4, goal: '🤼 운동 파트너 만들기', select: false },
    { id: 5, goal: '👩🏻‍⚕️ 영양 정보', select: false },
    { id: 6, goal: '🥗 식단 관리', select: false },
    { id: 7, goal: '🤽🏻‍♂️ 복근 만들기', select: false },
    { id: 8, goal: '🧍🏻 마른 몸 벗어나기', select: false },
    { id: 9, goal: '🍎 애플힙 만들기', select: false },
  ];
  const [selectedCity, setSelectedCity] = useState<string>(myInfo.city);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    myInfo.district,
  );

  const initWorkoutGoal = (goals: string[]) => {
    const newWorkoutGoalList = workoutGoalList.map(item => {
      if (goals.includes(item.goal)) {
        return { ...item, select: true };
      } else {
        return { ...item, select: false };
      }
    });
    return newWorkoutGoalList;
  };

  const [myWorkoutGoalState, setMyWorkoutGoalState] = useState(
    initWorkoutGoal(myInfo.workoutGoal ? myInfo.workoutGoal.split(',') : []),
  );

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const makeImageUri = useCallback((uri: string): string => {
    return Platform.OS === 'android' ? uri : uri.replace('file://', '');
  }, []);
  const putMyInfoMutation = usePutMyInfoMutation();
  const onSaveButtonClicked = useCallback(() => {
    setIsLoading(true);
    const data = new FormData();
    if (selectedImage && myInfoState.profilePic !== myInfo.profilePic) {
      data.append('file', {
        uri: myInfoState.profilePic,
        type: selectedImage.type,
        name: selectedImage.fileName,
      });
    }
    const newMyGoal = myWorkoutGoalState
      .map(item => {
        if (item.select === true) {
          return item.goal;
        }
      })
      .filter(item => item !== undefined);
    const myInfoUpdate: UserUpdate = {
      ...myInfoState,
      city: selectedCity,
      district: selectedDistrict,
      workoutGoal: newMyGoal.join(','),
      gymInfo: gymInfo,
    };

    putMyInfoMutation.mutate({
      user: myInfoUpdate,
      img: data,
    });
    setIsLoading(false);
    navigation.goBack();
  }, [
    gymInfo,
    myInfo.profilePic,
    myInfoState,
    myWorkoutGoalState,
    navigation,
    putMyInfoMutation,
    selectedCity,
    selectedDistrict,
    selectedImage,
  ]);

  const onPressProfilePic = useCallback(async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      presentationStyle: 'popover',
      selectionLimit: 1,
      quality: 0.1,
    };

    const res = await launchImageLibrary(options);
    if (res.didCancel) {
      console.log('User cancelled image picker');
    } else if (res.errorCode) {
      console.log('ImagePicker Error: ', res.errorCode);
      throw new Error(res.errorMessage);
    } else {
      if (res.assets && res.assets.length > 0 && res.assets[0].uri) {
        const uri = makeImageUri(res.assets[0].uri);
        setSelectedImage(res.assets[0]);
        setMyInfoState(prev => ({
          ...prev,
          profilePic: uri,
        }));
      }
    }
  }, [makeImageUri]);

  return (
    <View style={[style.container, { marginBottom: inset.bottom }]}>
      {/* Profile picture Pick */}
      <ScrollView
        style={style.container}
        keyboardDismissMode="interactive"
        contentContainerStyle={style.scrollViewContentContainer}
        automaticallyAdjustKeyboardInsets={true}
        nativeID="userInfoUpdateScroll">
        <View style={style.profileContainer}>
          <View style={style.avatarContainer}>
            <CustomAvatar
              username={myInfo.username[0]}
              profilePic={myInfoState.profilePic}
              size={64}
            />
          </View>
          <View style={style.usernameContainer}>
            <Text variant="titleMedium">{myInfo.username} 님</Text>
          </View>
          <Button
            style={style.btn}
            mode="contained"
            onPress={onPressProfilePic}>
            프로필 사진 수정
          </Button>
        </View>

        {/* 운동 목표 */}
        <View style={style.myGoalSection}>
          <View style={style.title}>
            <Text variant="titleMedium">🏃🏻‍♀️ 나의 운동 목표</Text>
          </View>
          <ScrollView
            style={style.horizontalChipContainer}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}>
            {myWorkoutGoalState.map((item, index) => (
              <Chip
                key={item.id}
                selected={item.select}
                selectedColor={theme.colors.primary}
                onPress={() => {
                  setMyWorkoutGoalState(prev => {
                    const newWorkoutGoalList = [...prev];
                    newWorkoutGoalList[index].select = !item.select;
                    return newWorkoutGoalList;
                  });
                }}
                style={style.chip}>
                {item.goal}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* 신체 정보 */}
        <View style={style.myBodySection}>
          <View style={style.title}>
            <Text variant="titleMedium">🏋🏻 나의 피지컬</Text>
          </View>
          <View style={style.physicalContainer}>
            <InfoEditCardNumeric
              textTitle="height"
              textContent={myInfoState.height}
              contentColor={theme.colors.primary}
              unit="cm"
              setMyInfoState={setMyInfoState}
            />
            <InfoEditCardNumeric
              textTitle="weight"
              textContent={myInfoState.weight}
              contentColor={theme.colors.primary}
              unit="kg"
              setMyInfoState={setMyInfoState}
            />
            <InfoEditCardNumeric
              textTitle="age"
              textContent={getAge(myInfoState.age)}
              unit="세"
              contentColor={theme.colors.primary}
              setMyInfoState={setMyInfoState}
            />
            <InfoEditCardNumeric
              textTitle="workoutPerWeek"
              textContent={myInfoState.workoutPerWeek}
              contentColor={theme.colors.primary}
              unit="회 / 1주일"
              setMyInfoState={setMyInfoState}
            />
            <StringMenu
              title="workoutLevel"
              titleKorean="운동 경력"
              selectedValue={myInfoState.workoutLevel}
              setMyInfoState={setMyInfoState}
              valueList={['입문', '초급', '중급', '고급', '전문가']}
              valueListKorean={[
                '입문(1년 미만)',
                '초급(1년 이상 3년 미만)',
                '중급(3년 이상 5년 미만)',
                '고급(5년 이상)',
                '전문가',
              ]}
            />
            <StringMenu
              title="workoutTimePeriod"
              titleKorean="운동 시간대"
              selectedValue={myInfoState.workoutTimePeriod}
              setMyInfoState={setMyInfoState}
              valueList={['오전', '오후', '저녁', '새벽']}
            />
            <StringMenu
              title="workoutTimePerDay"
              titleKorean="일일 운동 시간(강도)"
              selectedValue={myInfoState.workoutTimePerDay}
              setMyInfoState={setMyInfoState}
              valueList={['0 ~ 1시간', '1 ~ 2시간', '2 ~ 3시간', '3시간 이상']}
            />
            {/* Disabled Now */}
            <StringMenu
              title="gender"
              titleKorean="성별"
              setMyInfoState={setMyInfoState}
              selectedValue={myInfoState.gender}
              valueList={['male', 'female', 'other']}
              valueListKorean={['남성', '여성', '그 외']}
            />

            {/* TODO: 체지방률, 인바디 정보 등 다양한 신체 정보 추가 */}
          </View>
        </View>

        {/* 기타 개인 정보 */}
        <View style={style.myInfoSection}>
          <View style={style.title}>
            <Text variant="titleMedium">ℹ️ 나의 정보</Text>
          </View>
          <View style={style.infoContainer}>
            <Card elevation={1}>
              <Card.Content>
                <TextInput
                  mode="outlined"
                  label={'내 소개'}
                  placeholder={'안녕하세요!'}
                  value={myInfoState.bio ?? undefined}
                  onChangeText={text => {
                    setMyInfoState(prev => ({
                      ...prev,
                      bio: text,
                    }));
                  }}
                  onEndEditing={() => {
                    if (myInfoState.bio?.length === 0) {
                      setMyInfoState(prev => ({
                        ...prev,
                        bio: null,
                      }));
                      return;
                    }
                  }}
                  blurOnSubmit={true}
                />
                {/* <TextInput
                  mode="outlined"
                  label={'동네'}
                  placeholder={'서울특별시 관악구'}
                  value={myInfoState.address ?? undefined}
                  onChangeText={text => {
                    setMyInfoState(prev => ({
                      ...prev,
                      address: text,
                    }));
                  }}
                  onEndEditing={() => {
                    if (myInfoState.address?.length === 0) {
                      setMyInfoState(prev => ({
                        ...prev,
                        address: null,
                      }));
                    }
                  }}
                  blurOnSubmit={true}
                /> */}

                <View style={style.pickerContainer}>
                  <Text style={style.pickerTitle}>동네</Text>
                  <ActivityAreaPicker
                    city={selectedCity}
                    district={selectedDistrict}
                    setCity={setSelectedCity}
                    setDistrict={setSelectedDistrict}
                    customStyle={style.pickerStyle}
                    customItemStyle={style.pickerItemStyle}
                  />
                </View>
                {gymInfo !== null ? (
                  <List.Item
                    title="헬스장"
                    right={() => (
                      <Button
                        mode="contained-tonal"
                        onPress={() => {
                          setIsBottomSheetOpen(prev => !prev);
                        }}
                        onLongPress={() => {
                          setGymInfo(null);
                        }}>
                        {gymInfo.name ?? '헬스장 선택'}
                      </Button>
                    )}
                  />
                ) : (
                  <List.Item
                    title="헬스장"
                    right={() => (
                      <Button
                        mode="contained-tonal"
                        onPress={() => {
                          setIsBottomSheetOpen(prev => !prev);
                        }}
                        onLongPress={() => {
                          setGymInfo(null);
                        }}>
                        {'헬스장 선택'}
                      </Button>
                    )}
                  />
                )}
                {/* TODO: replace this  */}
                {/* <List.Item
                  title="출석률"
                  right={() => <Text variant="bodySmall">80%</Text>}
                />
                <List.Item
                  title="운동 약속"
                  right={() => <Text variant="bodySmall">??회</Text>}
                /> */}
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>
      <Button
        nativeID="updateMyInfoButton"
        mode="elevated"
        loading={isBottomSheetOpen || isLoading}
        onPress={onSaveButtonClicked}>
        저장하기
      </Button>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 1,
  },
  usernameContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    marginVertical: 10,
  },
  icon: {
    position: 'absolute',
    right: -40,
    top: -22,
  },
  title: {
    paddingLeft: 12,
  },
  physicalContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 12,
    alignItems: 'center',
  },
  infoContainer: {
    padding: 12,
  },
  pickerTitle: {
    alignSelf: 'flex-start',
    paddingLeft: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  pickerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  pickerStyle: {
    height: 50,
    width: 150,
  },
  pickerItemStyle: {
    height: 50,
    width: 150,
    fontSize: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    maxHeight: 50,
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  horizontalChipContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingTop: 12,
    // 칩 양 옆 여백
    marginHorizontal: 12,
  },
  myBodySection: {
    flex: 1,
    marginBottom: 16,
    flexDirection: 'column',
  },

  myGoalSection: {
    flex: 2,
    marginBottom: 16,
  },

  myInfoSection: {
    flex: 2,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  horizontalScrollViewContentContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12,
  },
});
