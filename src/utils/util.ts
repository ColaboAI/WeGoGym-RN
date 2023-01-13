import { WorkoutGoal } from '@type/types';
import { getValueFor } from '@store/store';

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
    workout_level,
    workout_goal,
  };

  return info;
}
