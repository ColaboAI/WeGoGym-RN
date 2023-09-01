import { Picker } from '@react-native-picker/picker';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  city: string;
  district: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setDistrict: React.Dispatch<React.SetStateAction<string>>;
  customStyle?: ViewStyle;
  customItemStyle?: StyleProp<TextStyle>;
};

export const ActivityAreaPicker = (props: Props) => {
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

  const [cityIndex, setCityIndex] = React.useState<number>(0);
  const [districtIndex, setDistrictIndex] = React.useState<number>(0);

  return (
    <View style={style.pickerContainer}>
      <Picker
        selectedValue={props.city}
        style={props.customStyle}
        itemStyle={props.customItemStyle}
        onValueChange={(itemValue, itemIndex) => {
          props.setCity(itemValue);
          setCityIndex(itemIndex);
          props.setDistrict(districts[itemIndex].district[0]);
          setDistrictIndex(0);
        }}>
        {cities.map((city, index) => (
          <Picker.Item label={city.city} value={city.city} key={index} />
        ))}
      </Picker>
      <Picker
        selectedValue={props.district}
        style={props.customStyle}
        itemStyle={props.customItemStyle}
        onValueChange={(itemValue, itemIndex) => {
          props.setDistrict(itemValue);
          setDistrictIndex(itemIndex);
        }}>
        {districts[cityIndex].district.map((district, index) => (
          <Picker.Item label={district} value={district} key={index} />
        ))}
      </Picker>
    </View>
  );
};

const style = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
  },
});
