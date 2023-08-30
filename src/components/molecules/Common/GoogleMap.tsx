import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, {
  Callout,
  MapMarker,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import GooglePlacesInput from './GooglePlacesInput';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import CustomCallout from './CustomCallout';
import CustomMarkerView from './CustomMarkerView';
import mapStyle from '/asset/json/mapStyle.json';
import BottomSheet from '@gorhom/bottom-sheet';

type Props = {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  promiseLocation: PromiseLocation | null;
  setPromiseLocation: React.Dispatch<
    React.SetStateAction<PromiseLocation | null>
  >;
  bottomSheetRef: React.RefObject<BottomSheet>;
};

const GoogleMap = (props: Props) => {
  const markerRef = React.useRef<MapMarker>(null);
  const theme = useTheme();
  const [location, setLocation] = useState<Location>({
    lat: 27.5665,
    lng: 126.978,
  });
  const [title, setTitle] = useState<string>('현재 위치');
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    setIsLoading(true);
    getLocation();
    setIsLoading(false);
  }, []);

  const handlePlaceSelected = (
    _data: any,
    details: { geometry: { location: Location } },
  ) => {
    const { lat, lng } = details.geometry.location;
    setLocation({
      lat: lat,
      lng: lng,
    });

    if (_data.structured_formatting) {
      const newTitle = _data.structured_formatting.main_text;
      setTitle(newTitle);
      setDescription(_data.structured_formatting.secondary_text);
    } else {
      const newTitle = _data.formatted_address;
      setTitle(newTitle);
      setDescription(newTitle);
    }
  };

  const onPressCallout = () => {
    props.setIsBottomSheetOpen(false);
    props.bottomSheetRef.current?.close();
    props.setPromiseLocation({
      placeName: title,
      address: description,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={isLoading} />
      <View style={styles.search}>
        <GooglePlacesInput onSelectPlace={handlePlaceSelected} />
      </View>

      {location && isLoading !== true && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={theme.dark ? mapStyle.darkMapStyle : []}
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
            description={description}
            onLayout={() => {
              markerRef.current?.showCallout();
            }}
            ref={markerRef}>
            <CustomMarkerView
              customMarkerStyle={[
                styles.customMarker,
                { backgroundColor: theme.colors.tertiary },
              ]}>
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
            <Callout
              key={title}
              alphaHitTest
              tooltip
              onPress={() => {
                onPressCallout();
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
