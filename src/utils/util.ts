import { getValueFor } from '@/store/secureStore';
import { GYM_OPEN_API_KEY } from '@env';
import { v4 as uuid } from 'uuid';

export function getGoal(goals: WorkoutGoal[]) {
  return goals
    .filter(goal => goal.select === true)
    .map(goal => goal.goal)
    .join(',');
}

export async function getInfo(): Promise<UserCreate> {
  const phoneNumber = (await getValueFor('phoneNumber')) ?? '';
  const username = (await getValueFor('username')) ?? '';
  const gender = (await getValueFor('gender')) ?? '';
  const age = (await getValueFor('age')) ?? '0';
  const height = (await getValueFor('height')) ?? '0';
  const weight = (await getValueFor('weight')) ?? '0';
  const workoutPerWeek = (await getValueFor('workoutPerWeek')) ?? '0';
  const workoutTimePeriod = (await getValueFor('workoutTimePeriod')) ?? '';
  const workoutTimePerDay = (await getValueFor('workoutTimePerDay')) ?? '';
  const workoutLevel = (await getValueFor('workoutLevel')) ?? '';
  const workoutGoal = (await getValueFor('workoutGoal')) ?? '';

  const info = {
    phoneNumber,
    username,
    gender,
    age: parseInt(age, 10),
    height: parseInt(height, 10),
    weight: parseInt(weight, 10),
    workoutPerWeek: parseInt(workoutPerWeek, 10),
    workoutTimePeriod,
    workoutTimePerDay,
    workoutLevel,
    workoutGoal,
  };
  return info;
}

export async function getGymInfoFromApi() {
  const index = [
    { start: 1, end: 1000 },
    { start: 1001, end: 2000 },
    { start: 2001, end: 3000 },
    { start: 3001, end: 4000 },
    { start: 4001, end: 5000 },
    { start: 5001, end: 6000 },
  ];
  const gym: Gym[] = [];
  index.map(async rowNum => {
    const url = `http://openapi.seoul.go.kr:8088/${GYM_OPEN_API_KEY}/json/LOCALDATA_104201/${rowNum.start}/${rowNum.end}/`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      const data = json.LOCALDATA_104201.row;
      const gymArr = data.map((item: GymInfo) => {
        return {
          id: uuid(),
          status: item.TRDSTATEGBN,
          name: item.BPLCNM,
          address: item.SITEWHLADDR,
          zipCode: item.RDNPOSTNO,
        };
      });
      gym.push(...gymArr.filter((item: Gym) => item.status === '01'));
    } catch (error) {
      console.log(error);
    }
  });
  return gym;
}

export function getLocaleDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}. ${month}. ${day}`;
}

export function getLocaleTime(date: Date) {
  const hour = date.getHours();
  const minute = date.getMinutes();

  if (hour === 0 && minute === 0) {
    return '오전 12시';
  } else if (hour === 0 && minute !== 0) {
    return `오전 ${hour}시 ${minute}분`;
  } else if (hour < 12 && minute === 0) {
    return `오전 ${hour}시`;
  } else if (hour < 12 && minute !== 0) {
    return `오전 ${hour}시 ${minute}분`;
  } else if (hour === 12 && minute === 0) {
    return '오후 12시';
  } else if (hour === 12 && minute !== 0) {
    return `오후 ${hour}시 ${minute}분`;
  } else if (hour > 12 && minute === 0) {
    return `오후 ${hour - 12}시`;
  } else if (hour > 12 && minute !== 0) {
    return `오후 ${hour - 12}시 ${minute}분`;
  }
}

export function isToday(date: Date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
