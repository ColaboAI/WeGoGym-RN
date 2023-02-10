interface User {
  _id: string | number;
  name?: string;
  profilePic?: string;
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

interface WorkoutPromiseCreate extends WorkoutPromiseBase {
  _id: string; // id
  user: UserCreate; // 작성자
  createdAt: Date; // 생성일
  image?: string; // 이미지
  // updatedAt: Date; // 수정일
}

interface GymInfo {
  TRDSTATEGBN: string; // 영업상태코드
  BPLCNM: string; // 사업자명
  SITEWHLADDR: string; // 도로명주소
  RDNPOSTNO: string; // 도로명우편번호
}

interface Gym {
  id: string;
  status: string;
  name: string;
  address: string;
  zipCode: string;
}

interface UserBase {
  _id: string;
  phone_number: string | null;
}

interface UserCreate extends UserBase {
  uri?: string;
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
interface UserRead extends UserCreate {
  createdAt: Date;
  updatedAt: Date;
}

type UserLoginResponse = {
  token: string;
  refresh_token: string;
};
