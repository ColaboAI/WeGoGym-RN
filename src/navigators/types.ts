import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type ChatParamList = {
  userId?: string;
  chatRoomId?: string;
  chatRoomName?: string;
  chatRoomDescription?: string;
  chatRoomImage?: string;
  isGroupChat?: boolean;
  chatRoomMembers?: ChatRoomMember[];
};

export type CommunityParamList = {
  communityId?: number;
  communityName?: string;
  postId?: number;
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatRoom: ChatParamList;
} & UserStackParamList;

export type HomeStackParamList = {
  Home: undefined;
  Details: { workoutPromiseId: string };
  Posting: undefined;
  Notifications: undefined;
  MyWorkoutPromises: undefined;
  PromiseEdit: { workoutInfo: WorkoutPromiseRead };
} & UserStackParamList &
  CommunityStackParamList;

export type CommunityStackParamList = {
  // CommunityList: undefined;
  PostList: { communityId?: number };
  PostDetail: { postId: number; communityId?: number; communityName?: string };
  PostCreate: undefined;
  PostEdit: { postId: number; communityId?: number };
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
  WorkoutPerWeek: undefined;
  WorkoutLevel: undefined;
  WorkoutStyleAndRoutine: undefined;
  ActivityArea: undefined;
  WorkoutPartnerGender: undefined;
  ProfileImage: undefined;
  WorkoutGoal: undefined;
};

// TODO: Refactor this to myinfo type
export type UserStackParamList = {
  User: { userId?: string };
  Setting: undefined;
  ProfileEdit: { myInfo: MyInfoRead };
};

export type RootStackParamList = {
  Auth: undefined;
  MainNavigator: NavigatorScreenParams<BottomTabParamList>;
};

export type BottomTabParamList = {
  홈: NavigatorScreenParams<HomeStackParamList>;
  덤벨챗: NavigatorScreenParams<ChatStackParamList>;
  커뮤니티: NavigatorScreenParams<CommunityStackParamList>;
  마이: NavigatorScreenParams<UserStackParamList>;
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

export type CommunityStackScreenProps<T extends keyof CommunityStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<CommunityStackParamList, T>,
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
