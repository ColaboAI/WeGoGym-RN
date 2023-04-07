import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackScreen, ChatStackScreen, UserStackScreen } from '.';
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomTabParamList } from './types';
import { useTheme } from 'react-native-paper';

const Tab = createBottomTabNavigator<BottomTabParamList>();
// Tab Navigator: Main Root Navigator
// nested Stack Navigator: HomeStackScreen, ChatStackScreen...
// @refresh reset

const MainNavigator = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.onBackground,
        tabBarInactiveTintColor: theme.colors.onBackground,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === '홈') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === '채팅') {
            iconName = focused ? 'chatbubble-sharp' : 'chatbubble-outline';
          } else if (route.name === '마이') {
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
      })}>
      {/* TODO: Add Stack Screens */}
      <Tab.Screen
        name="홈"
        component={HomeStackScreen}
        options={{
          tabBarIconStyle: { display: 'flex' },
          tabBarLabelPosition: 'below-icon',
        }}
      />
      <Tab.Screen
        name="채팅"
        component={ChatStackScreen}
        options={{
          tabBarIconStyle: { display: 'flex' },
          tabBarLabelPosition: 'below-icon',
        }}
      />
      <Tab.Screen
        name="마이"
        component={UserStackScreen}
        options={{
          tabBarIconStyle: { display: 'flex' },
          tabBarLabelPosition: 'below-icon',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
