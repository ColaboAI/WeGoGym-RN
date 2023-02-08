import { getValueFor } from '@store/store';
// TODO: change to https
const BASE_URL = 'http://127.0.0.1:8000/api/v1';

// TODO: add param like firebase uid to identify user
async function postLogin(phoneNumber: string): Promise<UserLoginResponse> {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    body: JSON.stringify({ phone_number: phoneNumber }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
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
        phone_number: '010-1234-5678',
        uri: 'https://i.ibb.co/Y725W4C/image.png',
        username: '권민규',
        gender: '남자',
        age: '25',
        height: '180',
        weight: '70',
        workout_per_week: '3',
        workout_time: '1',
        workout_time_how_long: '1',
        workout_level: '1',
        workout_goal: '1',
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
        phone_number: '010-1234-5678',
        uri: 'https://i.ibb.co/VwvkLpy/IMG-3484.jpg',
        username: '공성현',
        gender: '남자',
        age: '25',
        height: '180',
        weight: '70',
        workout_per_week: '3',
        workout_time: '1',
        workout_time_how_long: '1',
        workout_level: '1',
        workout_goal: '1',
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
        phone_number: '010-1234-5678',
        uri: 'https://i.ibb.co/hYd43VG/IMG-3486.jpg',
        username: '김도연',
        gender: '남자',
        age: '25',
        height: '180',
        weight: '70',
        workout_per_week: '3',
        workout_time: '1',
        workout_time_how_long: '1',
        workout_level: '1',
        workout_goal: '1',
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
        phone_number: '010-1234-5678',
        uri: 'https://i.ibb.co/hYd43VG/IMG-3486.jpg',
        username: '김도연',
        gender: '남자',
        age: '25',
        height: '180',
        weight: '70',
        workout_per_week: '3',
        workout_time: '1',
        workout_time_how_long: '1',
        workout_level: '1',
        workout_goal: '1',
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
        phone_number: '010-1234-5678',
        uri: 'https://i.ibb.co/hYd43VG/IMG-3486.jpg',
        username: '김도연',
        gender: '남자',
        age: '25',
        height: '180',
        weight: '70',
        workout_per_week: '3',
        workout_time: '1',
        workout_time_how_long: '1',
        workout_level: '1',
        workout_goal: '1',
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
      phone_number: '010-1234-5678',
      uri: 'https://i.ibb.co/Y725W4C/image.png',
      username: '권민규',
      gender: '남자',
      age: '25',
      height: '180',
      weight: '70',
      workout_per_week: '3',
      workout_time: '1',
      workout_time_how_long: '1',
      workout_level: '1',
      workout_goal: '1',
    },
    {
      _id: '2',
      phone_number: '010-1234-5678',
      uri: 'https://i.ibb.co/VwvkLpy/IMG-3484.jpg',
      username: '공성현',
      gender: '남자',
      age: '25',
      height: '180',
      weight: '70',
      workout_per_week: '3',
      workout_time: '1',
      workout_time_how_long: '1',
      workout_level: '1',
      workout_goal: '1',
    },
    {
      _id: '3',
      phone_number: '010-1234-5678',
      uri: 'https://i.ibb.co/hYd43VG/IMG-3486.jpg',
      username: '김도연',
      gender: '남자',
      age: '25',
      height: '180',
      weight: '70',
      workout_per_week: '3',
      workout_time: '1',
      workout_time_how_long: '1',
      workout_level: '1',
      workout_goal: '1',
    },
  ];
  return res;
}
async function postRegister(params: UserCreate): Promise<UserLoginResponse> {
  const res = await fetch(`${BASE_URL}/user/register`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
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

export { postLogin, postRegister, getMyInfo ,  postWorkoutPromise,getWorkoutPromise,getFriendList,};
