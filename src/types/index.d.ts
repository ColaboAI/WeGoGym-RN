type DatePickerMode = 'date' | 'time' | 'datetime';

interface User {
  id: string;
  username: string;
  profilePic?: string;
}

interface timestampMixin {
  createdAt: Date;
  updatedAt: Date;
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
  recruit_end_time: Date;
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
  recruitEndTime: Date;
  status: string;
  chatRoomId: string | null;
  // chatRoom: ChatRoom | null;
  isPrivate: boolean;
  adminUserId: string;
  gymInfo: Gym | null;
  participants: WorkoutParticipantsRead[];
}

interface WorkoutPromiseUpdate {
  title?: string;
  description?: string;
  isPrivate?: boolean;
  maxParticipants?: number;
  promise_time?: Date;
  recruit_end_time?: Date | null;
  gymInfo?: Gym | null;
  status?: string;
}

interface WorkoutPromiseListRead {
  total: number;
  items: WorkoutPromiseRead[];
  nextCursor: int | null;
  prevCursor: int | null;
}

interface WorkoutParticipantBase {
  name: string;
  status?: string;
  statusMessage: string;
  isAdmin?: boolean;
}

interface WorkoutParticipantsRead
  extends WorkoutParticipantBase,
    timestampMixin {
  id: string;
  userId: string;
  workoutPromiseId: string;
  chatRoomMemberId: string | null;
  // TODO: refactor user Type
  user: RecommendedMate;
}

interface WorkoutParticipantUpdate {
  name?: string;
  status?: string;
  statusMessage?: string;
  isAdmin?: boolean;
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
  [key: string]: string | number | null | undefined;
  // TODO: remove ID
  username: string;
  gender: string;
  age: string;
  height: number;
  weight: number;
  workoutPerWeek: number;
  // 오전 오후 저녁
  workoutTimePeriod: string;
  // 한번 운동하면 몇시간?
  workoutTimePerDay: string;
  workoutLevel: string;
  // 운동 스타일 (ex. 유산소, 근력)
  workoutStyle: string;
  // 운동 분할 (ex. 3분할)
  workoutRoutine: string;
  // 선호하는 운동 파트너 성별
  workoutPartnerGender: string;
  // 시/도
  city: string;
  // 구/군
  district: string;
  workoutGoal: string;
}

interface UserUpdate extends UserBase {
  [key: string]: string | number | null | undefined | Gym;
  username?: string;
  bio: string | null;
  age?: string;
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
  userId: string;
};

type RefreshTokenRequest = {
  token: string | null;
  refreshToken: string | null;
};

type RecommendedMate = {
  id: string;
  username: string;
  profilePic?: string;
};

type ChatRoom = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageText: string;
  lastMessageCreatedAt: Date;
  unreadCount: number | null;
  members: ChatRoomMember[];
  isPrivate: boolean;
  isGroupChat: boolean;
  // admin user id
  adminUserId: string;
  workoutPromiseId?: string;
};

type ChatRoomCreate = {
  name?: string;
  description?: string;
  membersUserIds: string[];
  isPrivate: boolean;
  isGroupChat: boolean;
  adminUserId: string;
  workoutPromiseId?: string;
};

type Message = {
  id: string;
  chatRoomId: string;
  userId: string;
  text: string;
  mediaUrl?: string;
  createdAt: Date;
};

type ChatRoomMember = {
  id: string;
  createdAt: Date;
  chatRoomId: string;
  user: User;
  lastReadAt: Date;
};

type ChatRoomMemberListResponse = {
  total: number;
  items: ChatRoomMember[];
};

type ChatRoomListResponse = {
  total: number;
  nextCursor: int | null;
  items: ChatRoom[];
};

type MessageListResponse = {
  total: number;
  nextCursor: int | null;
  items: Message[];
};

interface Notification {
  message: string;
  readAt: Date | null;
}

interface NotificationRead extends Notification {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationUpdate {
  readAt?: Date;
}

interface NotificationWorkout extends Notification {
  notificationType: string;
}

interface NotificationWorkoutRead extends NotificationWorkout {
  id: string;
  senderId: string;
  sender: WorkoutParticipantsRead;
  recipientId: string;
  recipient: WorkoutParticipantsRead;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationWorkoutListResponse {
  total: number;
  items: NotificationWorkoutRead[];
  nextCursor: int | null;
  prevCursor: int | null;
}

interface VOC {
  type: string;
  reason?: string;
  plaintiff?: string;
  defendant?: string;
  content: string;
}

interface CheckUserInfoResponse {
  phoneNumberExists: boolean | null;
  usernameExists: boolean | null;
}
interface CustomError extends Error {
  response?: {
    data: {
      errorCode: string;
      message: string;
    };
  };
}

interface Community extends timestampMixin {
  id: number;
  type: int;
  name: string;
  description: string;
}

interface PostCreate {
  communityId: number;
  title: string;
  content: string;
  video?: string[];
  wantAiCoach: boolean;
}

interface PostUpdate {
  title?: string;
  content?: string;
  video?: string[];
}

interface PostRead extends PostCreate, timestampMixin {
  id: number;
  image: string[] | null;
  video: string[];
  likeCnt: number;
  isLiked: number;
  available: boolean;
  user: User;
  commentCnt: number;
}

interface PostListRead {
  total: number;
  items: PostRead[];
  nextCursor: int | null;
}

interface CommentCreate {
  postId: number;
  content: string;
}

interface CommentUpdate {
  content?: string;
}

interface CommentRead extends CommentCreate, timestampMixin {
  id: number;
  user: User;
  likeCnt: number;
  isLiked: number;
  available: boolean;
}

interface CommentListRead {
  total: number;
  items: CommentRead[];
  nextCursor: int | null;
}
