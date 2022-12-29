import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
export type RootStackParamList = {
  // Auth: undefined;
  MainNavigator: NavigatorScreenParams<BottomTabParamList>;
};

export type BottomTabParamList = {
  Main: undefined;
  Chat: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatRoom: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Detail: undefined;
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

// export type CustomStackScreenProps

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
