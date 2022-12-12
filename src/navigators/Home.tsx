import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Button } from 'react-native';
import { HomeScreen } from '../screens';
import DetailsScreen from '../screens/Details';
const Stack = createNativeStackNavigator();
function Home() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'My home',
          headerRight: () => (
            <Button
              onPress={() => console.warn('This is a button!')}
              title="Info"
              color="#000"
            />
          ),
        }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default Home;
