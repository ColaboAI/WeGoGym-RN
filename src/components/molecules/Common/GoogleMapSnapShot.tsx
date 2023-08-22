import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, useTheme } from 'react-native-paper';
import CustomMarkerView from './CustomMarkerView';
import mapStyle from '/asset/json/mapStyle.json';

type Props = {
  promiseLocation: PromiseLocation;
};

const GoogleMapSnapShot = (props: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={theme.dark ? mapStyle.darkMapStyle : []}
        region={{
          latitude: props.promiseLocation.latitude,
          longitude: props.promiseLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude: props.promiseLocation.latitude,
            longitude: props.promiseLocation.longitude,
          }}>
          <CustomMarkerView
            customMarkerStyle={[
              styles.customMarker,
              { backgroundColor: theme.colors.tertiary },
            ]}
            size={18}>
            <Text
              style={[
                styles.customMarkerText,
                {
                  color: theme.colors.onBackground,
                  textShadowColor: theme.colors.background,
                },
              ]}>
              {props.promiseLocation.placeName}
            </Text>
          </CustomMarkerView>
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customMarkerText: {
    fontSize: 12,
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

export default GoogleMapSnapShot;
