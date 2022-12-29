import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { HomeScreen, DetailsScreen } from '../screens';
import CustomNavBarHeader from './CustomNavBarHeader';
const Stack = createNativeStackNavigator();
function Home() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: props => <CustomNavBarHeader title={'Home'} {...props} />,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default Home;
