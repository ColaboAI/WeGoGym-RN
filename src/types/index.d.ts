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
