import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackScreen } from '.';
import Icon from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

// @refresh reset
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Main') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Details') {
            iconName = focused
              ? 'person-circle-sharp'
              : 'person-circle-outline';
          } else {
            iconName = focused
              ? 'person-circle-sharp'
              : 'person-circle-outline';
          }
          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Main"
        component={HomeStackScreen}
        options={{
          tabBarIconStyle: { display: 'flex' },
          tabBarLabelPosition: 'below-icon',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
