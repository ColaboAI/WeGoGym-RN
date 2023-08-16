import React from 'react';
import { PLACE_API_KEY } from '@env';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type Props = {
  onSelectPlace: (data: any, details: any) => void;
};

const GooglePlacesInput = (props: Props) => {
  return (
    <GooglePlacesAutocomplete
      minLength={2}
      placeholder="위치 검색"
      query={{
        key: PLACE_API_KEY,
        language: 'ko',
        components: 'country:kr',
      }}
      keyboardShouldPersistTaps={'handled'}
      fetchDetails={true}
      onPress={(data, details) => {
        props.onSelectPlace(data, details);
        console.log('data', data);
        console.log('details', details);
      }}
      onFail={error => console.log(error)}
      onNotFound={() => console.log('no results')}
      keepResultsAfterBlur={true}
      enablePoweredByContainer={false}
      currentLocation={true}
      currentLocationLabel="현재 위치"
    />
  );
};

export default GooglePlacesInput;
