// import type { CompositeScreenProps } from '@react-navigation/native';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type BottomTabParamList = {
  Main: undefined;
  Chat: undefined;
};

export type ChatStackParamList = {
  Chat: undefined;
  ChatRoom: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Detail: undefined;
};

// export type ChatStackScreenProps<T extends keyof ChatStackParamList> =
//   CompositeScreenProps<
//     NativeStackScreenProps<ChatStackParamList, T>,
//     BottomTabScreenProps<keyof RootTabParamList>
//   >;

// declare global {
//   namespace ReactNavigation {
//     interface RootParamList extends RootTabParamList {}
//   }
// }
