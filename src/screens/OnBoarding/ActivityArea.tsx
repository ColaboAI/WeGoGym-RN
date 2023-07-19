import { StyleSheet, View, SafeAreaView } from 'react-native';
import React from 'react';
import { Button, Headline, useTheme, Text } from 'react-native-paper';
import { save } from '@store/secureStore';
import { AuthStackScreenProps } from 'navigators/types';
import { ActivityAreaPicker } from '/components/organisms/Common/ActivityAreaPicker';
type Props = AuthStackScreenProps<'ActivityArea'>;
export default function ActivityAreaScreen({ navigation }: Props) {
  const theme = useTheme();
  const [selectedCity, setSelectedCity] = React.useState<string>('서울특별시');
  const [selectedDistrict, setSelectedDistrict] =
    React.useState<string>('강남구');

  return (
    <SafeAreaView style={style.container}>
      <Text style={[style.helperTextBox, { color: theme.colors.outline }]}>
        프로필을 완성하기 위해 몇 가지만 여쭤볼게요. 잠깐이면 됩니다!
      </Text>
      <View style={style.headlineBox}>
        <Headline
          style={{
            color: theme.colors.secondary,
            fontWeight: 'bold',
            fontSize: 24,
          }}>
          주로 활동하는 지역은 어디인가요?
        </Headline>
        <Text style={[style.textBox, { color: theme.colors.outline }]}>
          선택하신 지역의 운동 친구를 만날 수 있어요.
        </Text>
      </View>
      <View style={style.pickerContainer}>
        <ActivityAreaPicker
          city={selectedCity}
          district={selectedDistrict}
          setCity={setSelectedCity}
          setDistrict={setSelectedDistrict}
          customStyle={{ height: 50, width: 180 }}
        />
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          onPress={() => {
            save('city', selectedCity);
            save('district', selectedDistrict);
            navigation.navigate('WorkoutPartnerGender');
          }}>
          확인
        </Button>
      </View>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  helperTextBox: {
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: '5%',
  },
  textBox: {
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  headlineBox: {
    flex: 1,
    margin: '5%',
    justifyContent: 'center',
  },
  pickerContainer: {
    flex: 2,
    flexDirection: 'row',
    margin: '5%',
    justifyContent: 'center',
  },
  menuBox: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    margin: '2%',
  },
  buttonBox: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
  },
});
