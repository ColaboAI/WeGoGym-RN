import { StyleSheet, View, SafeAreaView } from 'react-native';
import React from 'react';
import { Button, Headline, useTheme, Text } from 'react-native-paper';
import { save } from '@store/secureStore';
import { AuthStackScreenProps } from 'navigators/types';
import { Picker } from '@react-native-picker/picker';
type Props = AuthStackScreenProps<'ActivityArea'>;
export default function ActivityAreaScreen({ navigation }: Props) {
  const theme = useTheme();
  const cities = [
    { id: 0, city: '서울특별시' },
    { id: 1, city: '경기도' },
    { id: 2, city: '인천광역시' },
    // '대전광역시',
    // '광주광역시',
    // '대구광역시',
    // '울산광역시',
    // '부산광역시',
    // '강원도',
    // '충청북도',
    // '충청남도',
    // '전라북도',
    // '전라남도',
    // '경상북도',
    // '경상남도',
    // '제주특별자치도',
  ];
  const districts = [
    {
      id: 0,
      district: [
        '강남구',
        '강동구',
        '강북구',
        '강서구',
        '관악구',
        '광진구',
        '구로구',
        '금천구',
        '노원구',
        '도봉구',
        '동대문구',
        '동작구',
        '마포구',
        '서대문구',
        '서초구',
        '성동구',
        '성북구',
        '송파구',
        '양천구',
        '영등포구',
        '용산구',
        '은평구',
        '종로구',
        '중구',
        '중랑구',
      ],
    },
    {
      id: 1,
      district: [
        '가평군',
        '고양시',
        '과천시',
        '광명시',
        '광주시',
        '구리시',
        '군포시',
        '김포시',
        '남양주시',
        '동두천시',
        '부천시',
        '성남시',
        '수원시',
        '시흥시',
        '안산시',
        '안성시',
        '안양시',
        '양주시',
        '양평군',
        '여주시',
        '연천군',
        '오산시',
        '용인시',
        '의왕시',
        '의정부시',
        '이천시',
        '파주시',
        '평택시',
        '포천시',
        '하남시',
        '화성시',
      ],
    },
    {
      id: 2,
      district: [
        '강화군',
        '계양구',
        '남구',
        '남동구',
        '동구',
        '부평구',
        '서구',
        '연수구',
        '옹진군',
        '중구',
      ],
    },
  ];
  const [selectedCity, setSelectedCity] = React.useState<string>(
    cities[0].city,
  );
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>(
    districts[0].district[0],
  );
  const [cityIndex, setCityIndex] = React.useState<number>(0);
  const [districtIndex, setDistrictIndex] = React.useState<number>(0);
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
      <View style={style.menuContainer}>
        <View style={style.menuBox}>
          {/* <Menu
            visible={cityMenuVisible}
            onDismiss={() => setCityMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                style={{ backgroundColor: 'white' }}
                onPress={() => setCityMenuVisible(true)}>
                {selectedCity ? selectedCity : '시/도'}
              </Button>
            }
            anchorPosition="bottom">
            {cities.map((city, index) => (
              <Menu.Item
                onPress={() => {
                  setSelectedCity(city.city);
                  setCityIndex(index);
                  setDistrictMenuVisible(false);
                  setSelectedDistrict('');
                  setDistrictIndex(0);
                  setCityMenuVisible(false);
                }}
                title={city.city}
                key={index}
              />
            ))}
          </Menu> */}
          <Picker
            selectedValue={selectedCity}
            style={{ height: 50, width: 180 }}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedCity(itemValue);
              setCityIndex(itemIndex);
              setSelectedDistrict(districts[itemIndex].district[0]);
              setDistrictIndex(0);
            }}>
            {cities.map((city, index) => (
              <Picker.Item label={city.city} value={city.city} key={index} />
            ))}
          </Picker>
        </View>
        <View style={style.menuBox}>
          {/* <Menu
            visible={districtMenuVisible}
            onDismiss={() => setDistrictMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                style={{ backgroundColor: 'white' }}
                disabled={!selectedCity}
                onPress={() => setDistrictMenuVisible(true)}>
                {selectedDistrict ? selectedDistrict : '군/구'}
              </Button>
            }
            anchorPosition="bottom">
            {districts[cityIndex].district.map((district, index) => (
              <Menu.Item
                onPress={() => {
                  setSelectedDistrict(district);
                  setDistrictIndex(index);
                  setDistrictMenuVisible(false);
                }}
                title={district}
                key={index}
              />
            ))}
          </Menu> */}
          <Picker
            selectedValue={selectedDistrict}
            style={{ height: 50, width: 180 }}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedDistrict(itemValue);
              setDistrictIndex(itemIndex);
            }}>
            {districts[cityIndex].district.map((district, index) => (
              <Picker.Item label={district} value={district} key={index} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          onPress={() => {
            save('city', selectedCity);
            save('district', selectedDistrict);
            navigation.navigate('WorkoutGoal');
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
  menuContainer: {
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
