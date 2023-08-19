import React, { useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import GooglePlacesInput from './GooglePlacesInput';
import { Text, useTheme } from 'react-native-paper';
import CustomCallout from './CustomCallout';
import CustomMarkerView from './CustomMarkerView';

const GoogleMap = () => {
  const theme = useTheme();
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
        console.log('현재 위치', position);
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
    } else {
      setTitle(_data.formatted_address);
      setDescription('');
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
          }}
          zoomTapEnabled={false}>
          <Marker
            coordinate={{
              latitude: location.lat,
              longitude: location.lng,
            }}
            calloutOffset={{ x: -8, y: 20 }}
            calloutAnchor={{ x: 0.5, y: 0.25 }}
            title={title}
            description={description}>
            <CustomMarkerView>
              <Text
                style={[
                  styles.customMarkerText,
                  {
                    color: theme.colors.onBackground,
                    textShadowColor: theme.colors.background,
                  },
                ]}>
                {title}
              </Text>
            </CustomMarkerView>
            {title !== '' ? (
              <Callout
                alphaHitTest
                tooltip
                onPress={() => {
                  Alert.alert('클릭');
                }}
                style={styles.calloutView}>
                <CustomCallout>
                  <Text
                    style={[
                      styles.calloutTitle,
                      {
                        color: theme.colors.background,
                      },
                    ]}
                    numberOfLines={1}>
                    {title}
                  </Text>
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: theme.colors.background,
                      },
                    ]}>
                    선택
                  </Text>
                </CustomCallout>
              </Callout>
            ) : null}
          </Marker>
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
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customMarkerText: {
    fontWeight: 'bold',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 2,
  },
  calloutView: {
    width: 140,
    hegiht: 40,
  },
  calloutTitle: {
    fontSize: 12,
    width: '70%',
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default GoogleMap;
