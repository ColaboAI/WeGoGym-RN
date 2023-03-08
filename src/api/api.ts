import { Alert } from 'react-native';
import { apiClient } from './client';
import { AxiosError } from 'axios';
import { snakeCase } from 'snake-case';
// TODO: change to https
// TODO: change to real domain

// TODO: add param like firebase uid to identify user
async function postLogin(phoneNumber: string): Promise<UserLoginResponse> {
  try {
    const res = await apiClient.post('/user/login', {
      phoneNumber,
    });
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function postWorkoutPromise({
  workoutPromise,
  gymInfo,
}: {
  workoutPromise: WorkoutPromiseCreate;
  gymInfo: GymCreate | null;
}): Promise<WorkoutPromiseRead> {
  try {
    const res = await apiClient.post('/workout-promise', {
      workoutPromise,
      gymInfo,
    });
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function deleteWorkoutPromise(id: string): Promise<void> {
  try {
    const res = await apiClient.delete(`/workout-promise/${id}`);
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function putWorkoutPromiseInfo({
  workoutPromiseId,
  workoutPromise,
  gymInfo,
}: {
  workoutPromiseId: string;
  workoutPromise: WorkoutPromiseUpdate;
  gymInfo: GymCreate | null;
}): Promise<WorkoutPromiseRead> {
  try {
    const res = await apiClient.patch(`/workout-promise/${workoutPromiseId}`, {
      workoutPromise,
      gymInfo,
    });
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function postWorkoutParticipant({
  workoutParticipant,
  workoutPromiseId,
}: {
  workoutParticipant: WorkoutParictipantBase;
  workoutPromiseId: string;
}): Promise<WorkoutParictipantsRead> {
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
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
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
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function getWorkoutPromise({
  limit = 10,
  offset = null,
}: {
  limit: number;
  offset: number | null;
}): Promise<WorkoutPromiseListRead> {
  try {
    const res = await apiClient.get('/workout-promise', {
      params: {
        limit,
        offset,
      },
    });
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function getRecruitingWorkoutPromise({
  limit = 10,
  offset = null,
}: {
  limit: number;
  offset: number | null;
}): Promise<WorkoutPromiseListRead> {
  try {
    const res = await apiClient.get('/workout-promise/recruiting', {
      params: {
        limit,
        offset,
      },
    });
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function getWorkoutPromiseById(id: string): Promise<WorkoutPromiseRead> {
  try {
    const res = await apiClient.get(`/workout-promise/${id}`);
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function getWorkoutPromiseWrittenByUserId({
  userId,
  limit = 10,
  offset = null,
}: {
  userId: string;
  limit: number;
  offset: number | null;
}): Promise<WorkoutPromiseListRead> {
  try {
    const res = await apiClient.get(`/workout-promise/${userId}`, {
      params: {
        limit,
        offset,
      },
    });
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function getWorkoutPromiseJoinedByUserId({
  userId,
  limit = 10,
  offset = null,
}: {
  userId: string;
  limit: number;
  offset: number | null;
}): Promise<WorkoutPromiseListRead> {
  try {
    const res = await apiClient.get(`/workout-promise/participant/${userId}`, {
      params: {
        limit,
        offset,
      },
    });
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function postRegister(params: UserCreate): Promise<UserLoginResponse> {
  try {
    const res = await apiClient.post('/user/register', params);
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
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
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}
async function putMyInfo(
  params: UserUpdate,
  formData: FormData,
): Promise<MyInfoRead> {
  // TODO: Refactor
  const data = {} as UserUpdate;
  try {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        const value = params[key];
        const newKey = snakeCase(key);
        if (newKey === 'gym_info') {
          console.log('GymInfo: ', value);
        }
        if (typeof value === 'string') {
          data[newKey] = value.trim();
        } else {
          data[newKey] = value;
        }
      }
    });
    formData.append('data', JSON.stringify(data));
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

async function refreshAccessToken(
  param: RefreshTokenRequest,
): Promise<UserLoginResponse> {
  const res = await apiClient.post('/auth/refresh', param);
  return res.data;
}

async function getRecommendedMates(limit: number): Promise<RecommendedMate[]> {
  try {
    const res = await apiClient.get('/user/recommended-mates?limit=' + limit);
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function getMyChatList(param: {
  limit: number;
  offset: number;
}): Promise<ChatRoomListResponse> {
  try {
    const res = await apiClient.get(
      `/chat/rooms/me?limit=${param.limit}&offset=${param.offset}`,
    );
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getChatRoom(id: string): Promise<ChatRoom> {
  try {
    const res = await apiClient.get(`/chat/rooms/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function getChatMessages(
  id: string | undefined,
  limit: number,
  offset: number,
): Promise<MessageListResponse> {
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

async function getDirectChatRoom(id: string): Promise<ChatRoom> {
  try {
    const res = await apiClient.get(`/chat/rooms/direct?user_ids=${id}`);
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
};
