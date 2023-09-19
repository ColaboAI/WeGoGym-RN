import { StyleSheet, View } from 'react-native';
import React, { Suspense, useCallback } from 'react';
import PostDetailHeader from '/components/molecules/Community/PostDetailHeader';
import PostDetailBody from '/components/molecules/Community/PostDetailBody';
import PostDetailFooter from '/components/molecules/Community/PostDetailFooter';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import { Button, Divider, Text } from 'react-native-paper';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { usePostQuery } from '/hooks/queries/post.queries';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useAuthValue } from '/hooks/context/useAuth';

type Props = {
  postId: number;
  onPressEdit: (postId: number) => void;
};

export default function PostDetailSection({ postId, onPressEdit }: Props) {
  const { data: post } = usePostQuery(postId);
  const { reset } = useQueryErrorResetBoundary();
  const nav = useNavigation();
  const authInfo = useAuthValue();
  const navigateToUser = useCallback(() => {
    if (!post) return;

    nav.navigate('MainNavigator', {
      screen: '커뮤니티',
      params: {
        screen: 'User',
        params: {
          userId: post.user.id === authInfo?.userId ? 'me' : post.user.id,
        },
      },
    });
  }, [nav, post, authInfo?.userId]);

  const renderPostError = useCallback(
    ({ error, resetErrorBoundary }: FallbackProps) => {
      return (
        <View>
          게시글을 불러올 수 없습니다.
          <br />
          <br />
          <Text>{error.message}</Text>
          <Button onPress={() => resetErrorBoundary()}>다시 시도하기</Button>
        </View>
      );
    },
    [],
  );

  return (
    <ErrorBoundary onReset={reset} fallbackRender={renderPostError}>
      <Suspense fallback={<Text>Loading...</Text>}>
        <>
          {post && (
            <View style={styles.container}>
              <View style={styles.avatarSection}>
                <CustomAvatar
                  size={30}
                  profilePic={post.user.profilePic}
                  username={post.user.username}
                  onPress={navigateToUser}
                />
              </View>
              <View style={styles.postSection}>
                <PostDetailHeader
                  communityId={post.communityId}
                  postId={postId}
                  user={post.user}
                  updatedAt={post.updatedAt}
                  onPressEdit={onPressEdit}
                />
                <PostDetailBody post={post} />
                <PostDetailFooter
                  communityId={post.communityId}
                  postId={post.id}
                  likes={post.likeCnt}
                  isLiked={post.isLiked}
                />
              </View>
            </View>
          )}
          <Divider />
        </>
      </Suspense>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatarSection: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
  },
  postSection: {
    flex: 6,
    flexDirection: 'column',
  },
});
