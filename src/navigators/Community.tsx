import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { PostListScreen, PostCreateScreen, PostDetailScreen } from 'screens';
import CommunityHeader from './NavBarHeader/Community';
import { CommunityStackParamList, CustomTabScreenProps } from './types';
const Stack = createNativeStackNavigator<CommunityStackParamList>();
type Props = CustomTabScreenProps<'커뮤니티'>;

function Community({ navigation, route }: Props) {
  return (
    <Stack.Navigator
      initialRouteName="PostList"
      screenOptions={{
        header: props => <CommunityHeader {...props} />,
      }}>
      <Stack.Screen name="PostList" component={PostListScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="PostCreate" component={PostCreateScreen} />
      {/* <Stack.Screen name="PostEdit" component={PostEditScreen} /> */}
    </Stack.Navigator>
  );
}

export default Community;
