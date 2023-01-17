type WorkoutGoal = { id: number; goal: string; select: boolean };

type UserBase = {
  phone_number: string | null;
};

type UserCreate = UserBase & {
  username: string | null;
  gender: string | null;
  age: string | null;
  height: string | null;
  weight: string | null;
  workout_per_week: string | null;
  workout_time: string | null;
  workout_time_how_long: string | null;
  workout_level: string | null;
  workout_goal: string | null;
};

export type { WorkoutGoal, UserBase, UserCreate };
