import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
export type RootStackParamList = {
  Auth: undefined;
  MainNavigator: NavigatorScreenParams<BottomTabParamList>;
};

export type BottomTabParamList = {
  홈: undefined;
  채팅: undefined;
  마이: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatRoom: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Details: { workoutPromiseId: string };
  Posting: undefined;
  Notifications: undefined;
} & UserStackParamList;

export type AuthStackParamList = {
  Login: undefined;
  Welcome: undefined;
  PhoneNumberRegister: undefined;
  PhoneNumberLogin: undefined;
  Username: undefined;
  Gender: undefined;
  BodyInformation: undefined;
  WorkoutTimePeriod: undefined;
  WorkoutTimePerDay: undefined;
  WorkoutGoal: undefined;
  WorkoutPerWeek: undefined;
  WorkoutLevel: undefined;
};

// TODO: Refactor this to myinfo type
export type UserStackParamList = {
  User: { userId?: string };
  Setting: undefined;
  ProfileEdit: { myInfo: MyInfoRead };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type CustomTabScreenProps<T extends keyof BottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type ChatStackScreenProps<T extends keyof ChatStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ChatStackParamList, T>,
    CustomTabScreenProps<keyof BottomTabParamList>
  >;

export type UserStackScreenProps<T extends keyof UserStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<UserStackParamList, T>,
    CustomTabScreenProps<keyof BottomTabParamList>
  >;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    CustomTabScreenProps<keyof BottomTabParamList>
  >;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
