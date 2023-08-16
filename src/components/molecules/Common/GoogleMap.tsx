import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import GooglePlacesInput from './GooglePlacesInput';

const GoogleMap = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {
          coords: { latitude, longitude },
        } = position;
        setLocation({
          lat: latitude,
          lng: longitude,
        });
        console.log('현재 위치', { latitude, longitude });
      },
      error => {
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handlePlaceSelected = (
    _data: any,
    details: { geometry: { location: Location } },
  ) => {
    console.log('details', details);
    console.log('_data', _data);
    if (details.geometry) {
      const { lat, lng } = details.geometry.location;
      setLocation({
        lat: lat,
        lng: lng,
      });
    }
    if (_data.structured_formatting) {
      setTitle(_data.structured_formatting.main_text);
      setDescription(_data.structured_formatting.secondary_text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <GooglePlacesInput onSelectPlace={handlePlaceSelected} />
      </View>
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: location.lat,
              longitude: location.lng,
            }}
            title={title}
            description={description}
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  search: {
    height: 200,
    zIndex: 1,
  },
  map: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default GoogleMap;
