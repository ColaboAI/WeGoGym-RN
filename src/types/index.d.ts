type DatePickerMode = 'date' | 'time' | 'datetime';

interface User {
  _id: string | number;
  name?: string;
  profilePic?: string;
}

interface timestampMixin {
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
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

interface WorkoutGoal {
  id: number;
  goal: string;
  select: boolean;
}

interface Profile {
  uri: string;
  size: number;
  username: string;
}

interface WorkoutPromiseBase {
  title: string; // 제목
  description: string; // 설명
  location: string; // 장소
  date: Date; // 날짜
  time: Date; // 시간
  currentNumberOfPeople?: number; // 현재 참여 인원 (default: 1)
  limitedNumberOfPeople: number; // 제한 인원
}
interface WorkoutPromiseCreate {
  title: string;
  description: string;
  promise_time: Date;
  recruit_end_time: Date | null;
  maxParticipants: number;
  isPrivate: boolean;
}
interface GymCreate {
  status: string;
  name: string;
  address: string;
  // FormData에서 자동으로 case-convert 불가능해서 직접 지정(snake_case)
  zip_code: string;
}
interface Gym extends GymCreate {
  id: string;
  // TODO: fix
  zipCode: string;
}

interface WorkoutPromiseRead extends timestampMixin {
  id: string;
  title: string;
  description: string;
  maxParticipants: number;

  promiseTime: Date;
  recruitEndTime: Date | null;
  // chatRoomId: string | null;
  // chatRoom: ChatRoom | null;
  isPrivate: boolean;

  gymInfo: Gym | null;
  participants: WorkoutParicipantsRead[];
}
interface WorkoutPromiseListRead {
  total: number;
  items: WorkoutPromiseRead[];
}

interface WorkoutParicipantsRead extends timestampMixin {
  id: string;
  status: string;
  statusMessage: string;
  isAdmin: boolean;
  userId: string;
  workoutPromiseId: string;
  chatRoomMemberId: string | null;
}

interface GymInfoOpenAPI {
  TRDSTATEGBN: string; // 영업상태코드
  BPLCNM: string; // 사업자명
  RDNWHLADDR: string; // 도로명주소
  RDNPOSTNO: string; // 도로명우편번호
}

interface UserBase {
  phoneNumber: string | null;
  profilePic?: string;
}

interface UserCreate extends UserBase {
  // TODO: remove ID
  _id?: string;
  username: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  workoutPerWeek: number;
  // 오전 오후 저녁
  workoutTimePeriod: string;
  // 한번 운동하면 몇시간?
  workoutTimePerDay: string;
  workoutLevel: string;
  workoutGoal: string;
}

interface UserUpdate extends UserBase {
  [key: string]: string | number | null | undefined | Gym;
  username?: string;
  bio: string | null;
  age?: number;
  height?: number;
  weight?: number;
  workoutPerWeek?: number;
  workoutTimePeriod?: string;
  workoutTimePerDay?: string;
  workoutLevel?: string;
  gender?: string;
  workoutGoal: string | null;
  address: string | null;
  gymInfo: Gym | null;
}

interface UserRead extends UserCreate {
  createdAt: Date;
  updatedAt: Date;
}

interface MyInfoRead extends UserCreate {
  id: string;
  bio: string | null;
  gymInfo: Gym | null;
  address: string | null;
}

type UserLoginResponse = {
  token: string;
  refreshToken: string;
};

type RefreshTokenRequest = {
  token: string | null;
  refreshToken: string | null;
};
