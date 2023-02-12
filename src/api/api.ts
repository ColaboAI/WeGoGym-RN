import { getValueFor } from '@/store/secureStore';
import { Alert, Platform } from 'react-native';
import { handleNetworkErrorAlert } from './exception';
import { apiClient } from './client';
import { AxiosError } from 'axios';
// TODO: change to https
// TODO: change to real domain
const BASE_URL =
  Platform.OS === 'ios'
    ? 'http://127.0.0.1:8000/api/v1'
    : 'http://10.0.2.2:8000/api/v1';

// TODO: add param like firebase uid to identify user
async function postLogin(phoneNumber: string): Promise<UserLoginResponse> {
  try {
    const res = await apiClient.post(`${BASE_URL}/user/login`, {
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

async function postWorkoutPromise(params: WorkoutPromiseBase) {
  const res = await fetch('/auth/workout', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res;
}

async function getWorkoutPromise() {
  // const res = await api.get('/auth/workout');
  const res = [
    {
      _id: '1',
      user: {
        _id: '1',
        phoneNumber: '010-1234-5678',
        profilePic: 'https://i.ibb.co/Y725W4C/image.png',
        username: '권민규',
        gender: '남자',
        age: '25',
        height: '180',
        weight: '70',
        workoutPerWeek: '3',
        workoutTimePeriod: '1',
        workoutTimePerDay: '1',
        workoutLevel: '1',
        workoutGoal: '1',
      },
      title: '짐박스 봉천점에서 등 운동 하실 분',
      description: '짐박스 봉천점에서 등 운동 하실 분 구합니다.',
      location: '짐박스 봉천점',
      date: new Date(),
      time: new Date(),
      currentNumberOfPeople: 1,
      limitedNumberOfPeople: 3,
      createdAt: new Date(),
    },
    {
      _id: '2',
      user: {
        _id: '2',
        phoneNumber: '010-1234-5678',
        profilePic: 'https://i.ibb.co/VwvkLpy/IMG-3484.jpg',
        username: '공성현',
        gender: '남자',
        age: '25',
        height: '180',
        weight: '70',
        workoutPerWeek: '3',
        workoutTimePeriod: '1',
        workoutTimePerDay: '1',
        workoutLevel: '1',
        workoutGoal: '1',
      },
      title: '함서짐에서 어깨 운동',
      description: '함서짐에서 어깨 운동 하실 분 구합니다.',
      location: '함서짐',
      date: new Date(),
      time: new Date(),
      currentNumberOfPeople: 1,
      limitedNumberOfPeople: 4,
      createdAt: new Date(),
    },
    {
      _id: '3',
      user: {
        _id: '3',
        phoneNumber: '010-1234-5678',
        profilePic: 'https://i.ibb.co/hYd43VG/IMG-3486.jpg',
        username: '김도연',
        gender: '남자',
        age: '25',
        height: '180',
        weight: '70',
        workoutPerWeek: '3',
        workoutTimePeriod: '1',
        workoutTimePerDay: '1',
        workoutLevel: '1',
        workoutGoal: '1',
      },
      title: '함서짐에서 어깨 운동',
      description: '함서짐에서 어깨 운동 하실 분 구합니다.',
      location: '함서짐',
      date: new Date(),
      time: new Date(),
      currentNumberOfPeople: 1,
      limitedNumberOfPeople: 4,
      createdAt: new Date(),
    },
    {
      _id: '4',
      user: {
        _id: '4',
        phoneNumber: '010-1234-5678',
        profilePic: 'https://i.ibb.co/hYd43VG/IMG-3486.jpg',
        username: '김도연',
        gender: '남자',
        age: '25',
        height: '180',
        weight: '70',
        workoutPerWeek: '3',
        workoutTimePeriod: '1',
        workoutTimePerDay: '1',
        workoutLevel: '1',
        workoutGoal: '1',
      },
      title: '함서짐에서 어깨 운동',
      description: '함서짐에서 어깨 운동 하실 분 구합니다.',
      location: '함서짐',
      date: new Date(),
      time: new Date(),
      currentNumberOfPeople: 1,
      limitedNumberOfPeople: 4,
      createdAt: new Date(),
    },
    {
      _id: '5',
      user: {
        _id: '5',
        phoneNumber: '010-1234-5678',
        profilePic: 'https://i.ibb.co/hYd43VG/IMG-3486.jpg',
        username: '김도연',
        gender: '남자',
        age: '25',
        height: '180',
        weight: '70',
        workoutPerWeek: '3',
        workoutTimePeriod: '1',
        workoutTimePerDay: '1',
        workoutLevel: '1',
        workoutGoal: '1',
      },
      title: '함서짐에서 어깨 운동',
      description: '함서짐에서 어깨 운동 하실 분 구합니다.',
      location: '함서짐',
      date: new Date(),
      time: new Date(),
      currentNumberOfPeople: 1,
      limitedNumberOfPeople: 4,
      createdAt: new Date(),
    },
  ];

  return res;
}

async function getFriendList() {
  // const res = await api.get('/auth/friend');
  const res = [
    {
      _id: '1',
      phoneNumber: '010-1234-5678',
      profilePic: 'https://i.ibb.co/Y725W4C/image.png',
      username: '권민규',
      gender: '남자',
      age: '25',
      height: '180',
      weight: '70',
      workoutPerWeek: '3',
      workoutTimePeriod: '1',
      workoutTimePerDay: '1',
      workoutLevel: '1',
      workoutGoal: '1',
    },
    {
      _id: '2',
      phoneNumber: '010-1234-5678',
      profilePic: 'https://i.ibb.co/VwvkLpy/IMG-3484.jpg',
      username: '공성현',
      gender: '남자',
      age: '25',
      height: '180',
      weight: '70',
      workoutPerWeek: '3',
      workoutTimePeriod: '1',
      workoutTimePerDay: '1',
      workoutLevel: '1',
      workoutGoal: '1',
    },
    {
      _id: '3',
      phoneNumber: '010-1234-5678',
      profilePic: 'https://i.ibb.co/hYd43VG/IMG-3486.jpg',
      username: '김도연',
      gender: '남자',
      age: '25',
      height: '180',
      weight: '70',
      workoutPerWeek: '3',
      workoutTimePeriod: '1',
      workoutTimePerDay: '1',
      workoutLevel: '1',
      workoutGoal: '1',
    },
  ];
  return res;
}
async function postRegister(params: UserCreate): Promise<UserLoginResponse> {
  try {
    const res = await apiClient.post(`${BASE_URL}/user/register`, params);
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      Alert.alert(e.response?.data.message);
    }
    throw e;
  }
}

async function getMyInfo(): Promise<UserRead> {
  const token = await getValueFor('token');
  const res = await fetch(`${BASE_URL}/user/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
async function putMyInfo(params: UserCreate): Promise<UserRead> {
  const token = await getValueFor('token');
  const res = await fetch(`${BASE_URL}/user/me`, {
    method: 'PUT',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    handleNetworkErrorAlert(res);
  }
  return res.json();
}

async function refreshAccessToken(
  param: RefreshTokenRequest,
): Promise<UserLoginResponse> {
  const res = await apiClient.post('/auth/refresh', param);
  return res.data;
}

// async function verify(token: string): Promise<string> {}

export {
  postLogin,
  postRegister,
  getMyInfo,
  postWorkoutPromise,
  getWorkoutPromise,
  getFriendList,
  putMyInfo,
  refreshAccessToken,
};
