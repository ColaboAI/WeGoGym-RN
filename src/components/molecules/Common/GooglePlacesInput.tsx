import React from 'react';
import { PLACE_API_KEY } from '@env';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useSnackBarActions } from '/hooks/context/useSnackbar';

type Props = {
  onSelectPlace: (data: any, details: any) => void;
};

const GooglePlacesInput = (props: Props) => {
  const { onShow } = useSnackBarActions();
  return (
    <GooglePlacesAutocomplete
      minLength={1}
      placeholder="장소 이름이나 주소를 입력해주세요."
      query={{
        key: PLACE_API_KEY,
        language: 'ko',
        components: 'country:kr',
      }}
      fetchDetails={true}
      onPress={(data, details) => {
        props.onSelectPlace(data, details);
      }}
      onFail={error => onShow(error.message, 'error')}
      onNotFound={() => onShow('검색 결과가 없습니다.', 'error')}
      keyboardShouldPersistTaps={'handled'}
      keepResultsAfterBlur={true}
      enablePoweredByContainer={false}
      nearbyPlacesAPI="GoogleReverseGeocoding"
      textInputProps={{
        InputComp: TextInput,
        mode: 'outlined',
        left: (
          <TextInput.Icon
            icon="search-outline"
            size={15}
            style={styles.searchBtnIcon}
            rippleColor="transparent"
          />
        ),
        textColor: 'black',
      }}
      styles={{
        description: {
          color: 'black',
        },
      }}
      currentLocation={true}
      currentLocationLabel="현재 위치"
    />
  );
};

const styles = StyleSheet.create({
  searchBtnIcon: {
    top: 4,
  },
});

export default GooglePlacesInput;
