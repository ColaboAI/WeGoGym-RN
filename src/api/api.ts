import { AxiosError } from 'axios';
import { apiClient } from './client';
import { snakeCase } from 'snake-case';
import { Alert } from 'react-native';
import { makeSnakeKeyObject } from '/utils/util';
// TODO: change to https, deployed url
async function postLogin(phoneNumber: string): Promise<UserLoginResponse> {
  try {
    const res = await apiClient.post('/user/login', {
      phoneNumber,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postWorkoutPromise({
  workoutPromise,
  promiseLocation,
}: {
  workoutPromise: WorkoutPromiseCreate;
  promiseLocation: PromiseLocation | null;
}): Promise<WorkoutPromiseRead> {
  try {
    const res = await apiClient.post('/workout-promise', {
      workoutPromise,
      promiseLocation,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function deleteWorkoutPromise(id: string | undefined): Promise<void> {
  try {
    const res = await apiClient.delete(`/workout-promise/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function putWorkoutPromiseInfo({
  workoutPromiseId,
  workoutPromise,
  promiseLocation,
}: {
  workoutPromiseId: string;
  workoutPromise: WorkoutPromiseUpdate;
  promiseLocation: PromiseLocation | null;
}): Promise<WorkoutPromiseRead> {
  try {
    const res = await apiClient.patch(`/workout-promise/${workoutPromiseId}`, {
      workoutPromise,
      promiseLocation,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postWorkoutParticipant({
  workoutParticipant,
  workoutPromiseId,
}: {
  workoutParticipant: WorkoutParticipantBase;
  workoutPromiseId: string;
}): Promise<WorkoutParticipantsRead> {
  try {
    const res = await apiClient.post(
      `/workout-promise/${workoutPromiseId}/participants`,
      {
        status_message: workoutParticipant.statusMessage,
        name: workoutParticipant.name,
      },
    );
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function deleteWorkoutParticipant({
  workoutPromiseId,
  userId,
}: {
  workoutPromiseId: string;
  userId: string;
}): Promise<void> {
  try {
    const res = await apiClient.delete(
      `/workout-promise/${workoutPromiseId}/participants/${userId}`,
    );
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getWorkoutPromise(
  offset: number,
): Promise<WorkoutPromiseListRead> {
  const limit = 10;
  try {
    const res = await apiClient.get(
      `/workout-promise?limit=${limit}&offset=${offset}`,
    );
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getRecruitingWorkoutPromise(
  offset: number,
): Promise<WorkoutPromiseListRead> {
  const limit = 10;
  try {
    const res = await apiClient.get(
      `/workout-promise/recruiting?limit=${limit}&offset=${offset}`,
    );
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getWorkoutPromiseById(
  id: string | undefined,
): Promise<WorkoutPromiseRead> {
  try {
    const res = await apiClient.get(`/workout-promise/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getWorkoutPromiseWrittenByUserId(
  offset: number,
  userId: string,
): Promise<WorkoutPromiseListRead> {
  const limit = 10;
  try {
    const res = await apiClient.get(`/workout-promise/${userId}`, {
      params: {
        limit,
        offset,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getWorkoutPromiseJoinedByUserId(
  userId: string,
  offset: number,
): Promise<WorkoutPromiseListRead> {
  const limit = 10;
  try {
    const res = await apiClient.get(`/workout-promise/participant/${userId}`, {
      params: {
        limit,
        offset,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postRegister(
  params: UserCreate,
  formData: FormData,
): Promise<UserLoginResponse> {
  const data = {} as UserCreate;
  try {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        const value = params[key];
        const newKey = snakeCase(key);
        if (typeof value === 'string') {
          data[newKey] = value.trim();
        } else {
          data[newKey] = value;
        }
      }
    });
    formData.append('data', JSON.stringify(data));
    const res = await apiClient.post('/user/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function deleteUser(): Promise<void> {
  try {
    const res = await apiClient.delete('/user/unregister');
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getUserInfo(id: string): Promise<MyInfoRead> {
  try {
    const res = await apiClient.get(`/user/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function putMyInfo(
  params: UserUpdate,
  formData: FormData,
): Promise<MyInfoRead> {
  try {
    const data = makeSnakeKeyObject<UserUpdate>(params);
    formData.append('data', data);
    const res = await apiClient.patch('/user/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}
async function putMyFCMToken(token: string): Promise<void> {
  try {
    const res = await apiClient.patch('/user/me/fcm-token', token);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function refreshAccessToken(
  param: RefreshTokenRequest,
): Promise<UserLoginResponse> {
  try {
    const res = await apiClient.post('/auth/refresh', param);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getRecommendedMates(limit: number): Promise<RecommendedMate[]> {
  try {
    const res = await apiClient.get('/user/recommended-mates?limit=' + limit);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getMyChatList(param: {
  offset: number;
}): Promise<ChatRoomListResponse> {
  const limit = 20;
  try {
    const res = await apiClient.get(
      `/chat/rooms/me?limit=${limit}&offset=${param.offset}`,
    );
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getChatRoom(id?: string): Promise<ChatRoom> {
  if (id === undefined) {
    throw new Error('id is undefined');
  }
  try {
    const res = await apiClient.get(`/chat/rooms/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getChatMessages(
  id: string | undefined,
  offset: number,
): Promise<MessageListResponse> {
  const limit = 20;
  if (id === undefined) {
    return {
      total: 0,
      nextCursor: null,
      items: [],
    };
  }
  try {
    const res = await apiClient.get(
      `/chat/rooms/${id}/messages?limit=${limit}&offset=${offset}`,
    );
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getDirectChatRoom(id: string | undefined): Promise<ChatRoom> {
  try {
    if (id === undefined) {
      throw new Error('id is undefined');
    }
    const res = await apiClient.get(`/chat/room/direct?user_ids=${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postChatRoom(params: ChatRoomCreate): Promise<ChatRoom> {
  try {
    const res = await apiClient.post('/chat/rooms', params);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postChatRoomMember(
  roomId: string,
  userId: string,
): Promise<boolean> {
  try {
    await apiClient.post(`/chat/room/${roomId}/user/${userId}`);
    return true;
  } catch (e) {
    throw e;
  }
}

async function deleteChatRoomMember(
  roomId: string,
  userId: string,
): Promise<boolean> {
  try {
    await apiClient.delete(`/chat/room/${roomId}/user/${userId}`);
    return true;
  } catch (e) {
    throw e;
  }
}

async function getNotificationWorkout(
  offset: number,
): Promise<NotificationWorkoutListResponse> {
  const limit = 10;
  try {
    // FIXME: 맨 앞에 / 가 있어야하지 않나?
    const res = await apiClient.get(`notification/workout`, {
      params: {
        limit,
        offset,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function putWorkoutParticipant({
  workoutPromiseId,
  userId,
  workoutParticipant,
}: {
  workoutPromiseId: string;
  userId: string;
  workoutParticipant: WorkoutParticipantUpdate;
}): Promise<WorkoutParticipantBase> {
  try {
    const res = await apiClient.patch(
      `/workout-promise/${workoutPromiseId}/participants/${userId}`,
      workoutParticipant,
    );
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function putNotification({
  notificationId,
}: {
  notificationId: string;
}): Promise<NotificationRead> {
  try {
    const res = await apiClient.patch(`/notification/${notificationId}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postVOC(voc: VOC): Promise<void> {
  try {
    await apiClient.post('/voc/global', voc);
  } catch (e) {
    throw e;
  }
}
// React Query 사용 X
async function checkPhoneNumber(phoneNumber: string): Promise<boolean> {
  try {
    const res = await apiClient.get<CheckUserInfoResponse>(
      `/user/check?phone_number=${phoneNumber}`,
    );
    return res.data.phoneNumberExists === true;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(`${e.message}: ${e.response?.data.message}`);
    }
    throw e;
  }
}

// React Query 사용 X
async function checkUsername(username: string): Promise<boolean> {
  try {
    const res = await apiClient.get<CheckUserInfoResponse>(
      `/user/check?username=${username}`,
    );
    return res.data.usernameExists === true;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(`${e.code} ${e.message}: ${e.response?.data.message}`);
    }
    throw e;
  }
}

async function postBlockUser(userId: string): Promise<void> {
  try {
    await apiClient.post(`/user/block/${userId}`);
  } catch (e) {
    throw e;
  }
}

async function deleteBlockUser(userId: string): Promise<void> {
  try {
    await apiClient.delete(`/user/block/${userId}`);
  } catch (e) {
    throw e;
  }
}

async function getMyBlockedList(): Promise<RecommendedMate[]> {
  try {
    const res = await apiClient.get('/user/block');
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getLastestAppVersion(): Promise<AppVersion> {
  try {
    const res = await apiClient.get('/version');
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getCommunityList(): Promise<Community[]> {
  try {
    const res = await apiClient.get('/communities');
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getCommunity(id: number): Promise<Community> {
  try {
    const res = await apiClient.get(`/communities/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getPostList({
  communityId,
  offset,
}: {
  communityId: number | undefined;
  offset: number;
}): Promise<PostListRead> {
  const limit = 10;
  try {
    let queryParams = {};
    if (communityId !== undefined) {
      queryParams = { ...queryParams, communityId: communityId };
    }
    queryParams = { ...queryParams, limit: limit, offset: offset };
    const res = await apiClient.get('/communities/posts', {
      params: queryParams,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getPost(id: number): Promise<PostRead> {
  try {
    const res = await apiClient.get(`/communities/posts/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postPost({
  params,
  images,
}: {
  params: PostCreate;
  images: FormData;
}): Promise<PostRead> {
  try {
    const data = makeSnakeKeyObject<PostCreate>(params);
    images.append('post', data);
    const res = await apiClient.post('/communities/posts', images, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function patchPost({
  id,
  params,
  images,
}: {
  id: number;
  params: PostUpdate;
  images: FormData;
}): Promise<PostRead> {
  try {
    const res = await apiClient.patch(`/communities/posts/${id}`, images, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function deletePost(id: number): Promise<void> {
  try {
    const res = await apiClient.delete(`/communities/posts/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getCommentList({
  postId,
  offset,
}: {
  postId: number;
  offset: number;
}): Promise<CommentListRead> {
  const limit = 10;
  try {
    const res = await apiClient.get(`/communities/comments`, {
      params: {
        postId,
        limit,
        offset,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getComment(id: number): Promise<CommentRead> {
  try {
    const res = await apiClient.get(`/communities/comments/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postComment(params: CommentCreate): Promise<CommentRead> {
  try {
    const res = await apiClient.post(`/communities/comments`, params);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function patchComment({
  id,
  params,
}: {
  id: number;
  params: CommentUpdate;
}): Promise<CommentRead> {
  try {
    const res = await apiClient.patch(`/communities/comments/${id}`, params);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function deleteComment(id: number): Promise<void> {
  try {
    const res = await apiClient.delete(`/communities/comments/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postLikePost(id: number): Promise<PostRead> {
  try {
    const res = await apiClient.post(`/communities/posts/${id}/like`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postDisLikePost(id: number): Promise<PostRead> {
  try {
    const res = await apiClient.post(`/communities/posts/${id}/unlike`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postLikeComment(id: number): Promise<CommentRead> {
  try {
    const res = await apiClient.post(`/communities/comments/${id}/like`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function postDisLikeComment(id: number): Promise<CommentRead> {
  try {
    const res = await apiClient.post(`/communities/comments/${id}/unlike`);
    return res.data;
  } catch (e) {
    throw e;
  }
}
export {
  postLogin,
  postRegister,
  postWorkoutPromise,
  deleteWorkoutPromise,
  putWorkoutPromiseInfo,
  postWorkoutParticipant,
  deleteWorkoutParticipant,
  getWorkoutPromise,
  getRecruitingWorkoutPromise,
  getWorkoutPromiseWrittenByUserId,
  getWorkoutPromiseJoinedByUserId,
  getWorkoutPromiseById,
  getNotificationWorkout,
  putWorkoutParticipant,
  putNotification,
  putMyInfo,
  refreshAccessToken,
  deleteUser,
  getRecommendedMates,
  getUserInfo,
  getMyChatList,
  getChatRoom,
  getChatMessages,
  getDirectChatRoom,
  postChatRoom,
  deleteChatRoomMember,
  putMyFCMToken,
  postChatRoomMember,
  postVOC,
  checkUsername,
  checkPhoneNumber,
  postBlockUser,
  deleteBlockUser,
  getMyBlockedList,
  getLastestAppVersion,
  getCommunityList,
  getCommunity,
  getPostList,
  getPost,
  postPost,
  patchPost,
  deletePost,
  getComment,
  postComment,
  patchComment,
  deleteComment,
  getCommentList,
  postLikePost,
  postDisLikePost,
  postLikeComment,
  postDisLikeComment,
};
