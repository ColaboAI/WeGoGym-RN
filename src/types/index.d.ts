export interface User {
  _id: string | number;
  name?: string;
  profilePic?: string;
}

export interface Message {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
  isLeft: boolean;
  image?: string;
  // video?: string;
  // audio?: string;
  // system?: boolean;
  sent?: boolean;
  received?: boolean;
  // pending?: boolean;
}

export interface WorkoutGoal {
  id: number;
  goal: string;
  select: boolean;
}

export interface UserBase {
  phone_number: string | null;
}

export interface UserCreate extends UserBase {
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
}
