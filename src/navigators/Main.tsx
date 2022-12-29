import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackScreen, ChatStackScreen } from '.';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
// Tab Navigator: Main Root Navigator
// nested Stack Navigator: HomeStackScreen, ChatStackScreen...
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
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble-sharp' : 'chatbubble-outline';
          } else {
            iconName = focused
              ? 'person-circle-sharp'
              : 'person-circle-outline';
          }
          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      {/* TODO: Add Stack Screens */}
      <Tab.Screen
        name="Main"
        component={HomeStackScreen}
        options={{
          tabBarIconStyle: { display: 'flex' },
          tabBarLabelPosition: 'below-icon',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackScreen}
        options={{
          tabBarIconStyle: { display: 'flex' },
          tabBarLabelPosition: 'below-icon',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
