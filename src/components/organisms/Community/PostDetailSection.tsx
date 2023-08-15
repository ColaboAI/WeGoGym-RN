import { StyleSheet, View } from 'react-native';
import React, { Suspense, useCallback } from 'react';
import PostDetailHeader from '/components/molecules/Community/PostDetailHeader';
import PostDetailBody from '/components/molecules/Community/PostDetailBody';
import PostDetailFooter from '/components/molecules/Community/PostDetailFooter';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import { Divider, Text } from 'react-native-paper';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { usePostQuery } from '/hooks/queries/post.queries';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

type Props = {
  postId: number;
};

export default function PostDetailSection({ postId }: Props) {
  const { data: post } = usePostQuery(postId);
  const { reset } = useQueryErrorResetBoundary();

  const renderPostError = useCallback(
    ({ error, resetErrorBoundary }: FallbackProps) => {
      return (
        <View>
          게시글을 불러올 수 없습니다.
          <br />
          <br />
          <Text>{error.message}</Text>
          <button onClick={() => resetErrorBoundary()}>다시 시도하기</button>
        </View>
      );
    },
    [],
  );
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ErrorBoundary onReset={reset} fallbackRender={renderPostError}>
        <>
          {post && (
            <View style={styles.container}>
              <View style={styles.avatarSection}>
                <CustomAvatar
                  size={30}
                  profilePic={post.user.profilePic}
                  username={post.user.username}
                />
              </View>
              <View style={styles.postSection}>
                <PostDetailHeader user={post.user} updatedAt={post.updatedAt} />
                <PostDetailBody post={post} />
                <PostDetailFooter
                  postId={post.id}
                  likes={post.likeCnt}
                  isLiked={post.isLiked}
                />
              </View>
            </View>
          )}
          <Divider />
        </>
      </ErrorBoundary>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    marginBottom: 20,
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
