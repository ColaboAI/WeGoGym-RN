import { WorkoutGoal } from '../types';
import { getValueFor } from '@store/store';
import { API_KEY } from '@env';

export function getGoal(goals: WorkoutGoal[]) {
  return goals
    .filter(goal => goal.select === true)
    .map(goal => goal.goal)
    .toString();
}

export async function getInfo() {
  const phone_number = await getValueFor('phone_number');
  const username = await getValueFor('username');
  const gender = await getValueFor('gender');
  const age = await getValueFor('age');
  const height = await getValueFor('height');
  const weight = await getValueFor('weight');
  const workout_per_week = await getValueFor('workout_per_week');
  const workout_time = await getValueFor('workout_time');
  const workout_time_how_long = await getValueFor('workout_time_how_long');
  const workout_level = await getValueFor('workout_level');
  const workout_goal = await getValueFor('workout_goal');

  const info = {
    phone_number,
    username,
    gender,
    age,
    height,
    weight,
    workout_per_week,
    workout_time,
    workout_time_how_long,
    workout_level,
    workout_goal,
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
  const gym: string | any[] = [];
  index.map(async rowNum => {
    const url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/LOCALDATA_104201/${rowNum.start}/${rowNum.end}/`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      const data = json.LOCALDATA_104201.row;
      const gymArr = data.map(
        (item: { MGTNO: string; BPLCNM: string; SITEWHLADDR: string }) => {
          return {
            id: item.MGTNO,
            gymName: item.BPLCNM,
            gymAddress: item.SITEWHLADDR,
          };
        },
      );
      gym.push(...gymArr);
    } catch (error) {
      console.log(error);
    }
  });
  return gym;
}
