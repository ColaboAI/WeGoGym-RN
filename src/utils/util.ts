import { getValueFor } from 'store/secureStore';
import { GYM_OPEN_API_KEY } from '@env';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import { camelCase } from 'camel-case';
import { snakeCase } from 'snake-case';

export function convertObjectKeyToCamelCase<T>(obj: { [x: string]: any }) {
  const convertedData = Object.keys(obj).reduce((acc, key) => {
    return {
      ...acc,
      [camelCase(key)]: obj[key],
    };
  }, {} as T);
  return convertedData;
}

export function getGoal(goals: WorkoutGoal[]) {
  return goals
    .filter(goal => goal.select === true)
    .map(goal => goal.goal)
    .join(',');
}

export function getWorkoutPart(parts: WorkoutPart[]) {
  return parts
    .filter(part => part.select === true)
    .map(part => part.part)
    .join(',');
}

export function getInfo(): UserCreate {
  const phoneNumber = getValueFor('phoneNumber') ?? '';
  const username = getValueFor('username') ?? '';
  const gender = getValueFor('gender') ?? '';
  const age = getValueFor('age') ?? '0';
  const height = getValueFor('height') ?? '0';
  const weight = getValueFor('weight') ?? '0';
  const workoutPerWeek = getValueFor('workoutPerWeek') ?? '0';
  const workoutTimePeriod = getValueFor('workoutTimePeriod') ?? '';
  const workoutTimePerDay = getValueFor('workoutTimePerDay') ?? '';
  const workoutLevel = getValueFor('workoutLevel') ?? '';
  const workoutGoal = getValueFor('workoutGoal') ?? '';
  const workoutStyle = getValueFor('workoutStyle') ?? '';
  const workoutRoutine = getValueFor('workoutRoutine') ?? '';
  const city = getValueFor('city') ?? '';
  const district = getValueFor('district') ?? '';
  const workoutPartnerGender = getValueFor('workoutPartnerGender') ?? '';

  const info = {
    phoneNumber,
    username,
    gender,
    age,
    height: parseInt(height, 10),
    weight: parseInt(weight, 10),
    workoutPerWeek: parseInt(workoutPerWeek, 10),
    workoutTimePeriod,
    workoutTimePerDay,
    workoutLevel,
    workoutGoal,
    workoutStyle,
    workoutRoutine,
    city,
    district,
    workoutPartnerGender,
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
      const gymArr = data.map((item: GymInfoOpenAPI) => {
        return {
          id: uuid(),
          status: item.TRDSTATEGBN.trim(),
          name: item.BPLCNM.trim(),
          address: item.RDNWHLADDR.trim(),
          zip_code: item.RDNPOSTNO.trim(),
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
  let newDate: Date;
  if (typeof date === 'string') {
    newDate = new Date(date);
  } else {
    newDate = date;
  }

  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();
  return `${year}. ${month}. ${day}`;
}

export function getLocaleTime(date: Date | string) {
  let newDate: Date;
  if (typeof date === 'string') {
    newDate = new Date(date);
  } else {
    newDate = date;
  }
  const hour = newDate.getHours();
  const minute = newDate.getMinutes();

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
  let newDate: Date;
  if (typeof date === 'string') {
    newDate = new Date(date);
  } else {
    newDate = date;
  }

  return (
    newDate.getFullYear() === today.getFullYear() &&
    newDate.getMonth() === today.getMonth() &&
    newDate.getDate() === today.getDate()
  );
}

export function getRelativeTime(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const today = new Date();
  const delta = today.getTime() - date.getTime();

  let differSec = delta / 1000;

  if (differSec < 1) {
    return '방금';
  }
  if (differSec < 60) {
    return `${Math.floor(differSec)}초 전`;
  }
  if (differSec < 3600) {
    return `${Math.floor(differSec / 60)}분 전`;
  }
  if (differSec < 24 * 3600) {
    return `${Math.floor(differSec / 3600)}시간 전`;
  }

  if (today.getFullYear() === date.getFullYear()) {
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      month: 'short',
      day: 'numeric',
    });
  } else {
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

export function getDday(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const today = new Date();
  const delta = date.getTime() - today.getTime();

  let differDay = delta / (1000 * 3600 * 24);
  if (Math.abs(differDay) < 1) {
    return '오늘';
  } else if (differDay < 0) {
    return `D+${Math.floor(Math.abs(differDay))}`;
  } else {
    return `D-${Math.floor(differDay)}`;
  }
}

// admin인가
export function isAdmin(userId: string, adminUserId: string) {
  return userId === adminUserId;
}

// 모집 중인가
export function isRecruiting(status: string) {
  return status === 'RECRUITING';
}

// 모집이 끝났는가
export function isRecruitedEnded(status: string) {
  return status === 'RECRUIT_ENDED';
}

// 참여자 중에서 수락된 사람만 가져오기(admin이 먼저 나오도록 정렬)
export function isAcceptedParticipant(paticipants: WorkoutParticipantsRead[]) {
  const acceptedParticipants = paticipants.filter(
    participant => participant.status === 'ACCEPTED',
  );
  const result = acceptedParticipants
    .filter(acceptedParticipant => acceptedParticipant.isAdmin === true)
    .concat(
      acceptedParticipants.filter(
        acceptedParticipant => acceptedParticipant.isAdmin === false,
      ),
    );
  return result;
}

// 참여 요청을 보낸 적이 있는가
export function isRequested(
  paticipants: WorkoutParticipantsRead[],
  userId: string,
) {
  const requestedParticipants = paticipants.filter(
    participant =>
      (participant.status === 'PENDING' || participant.status === 'ACCEPTED') &&
      participant.userId === userId,
  );

  return requestedParticipants.length !== 0;
}

export function getMyParticipant(
  paticipants: WorkoutParticipantsRead[],
  userId: string,
) {
  const myParticipant = paticipants.find(
    participant => participant.userId === userId,
  );
  if (myParticipant === undefined) {
    return null;
  }
  return myParticipant;
}

export function getChatRoomNameFromMembers(members: ChatRoomMember[]) {
  const myId = getValueFor('userId');
  if (myId === null) {
    return '';
  }
  const otherMembers = members.filter(member => {
    if (member.user.id !== myId) {
      return true;
    }
  });
  if (otherMembers.length === 1) {
    return otherMembers[0].user.username;
  }
  return otherMembers.flatMap(member => member.user.username).join(', ');
}

export function getNotificationBody(notificationType: string): string {
  switch (notificationType) {
    case 'NEW_WORKOUT_PROMISE':
      return '새로운 운동 약속이 있습니다!';
    case 'WORKOUT_REQUEST':
      return '이 운동 약속 참여 요청을 보냈습니다:';
    case 'WORKOUT_ACCEPT':
      return '이 운동 약속 참여를 승인하였습니다.';
    case 'WORKOUT_REJECT':
      return '이 운동 약속 참여를 거절하였습니다.';
    case 'WORKOUT_NEW_PARTICIPANT':
      return '이 운동 약속에 참여하였습니다.';
    case 'WORKOUT_RECRUIT_END':
      return '이 운동 약속 참여자 모집을 완료하였습니다.';
    default:
      return '';
  }
}

export function getAge(birth: string) {
  const today = new Date();
  let age = today.getFullYear() - Number(birth.slice(0, 4));
  const month = today.getMonth() + 1 - Number(birth.slice(4, 6));
  if (
    month < 0 ||
    (month === 0 && today.getDate() < Number(birth.slice(6, 8)))
  ) {
    age--;
  }
  return age;
}

export function makeSnakeKeyObject<T extends Record<string, any>>(
  obj: T,
): string {
  const convertedData = Object.entries(obj).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [snakeCase(key)]: value,
    };
  }, {} as T);
  return JSON.stringify(convertedData);
}
