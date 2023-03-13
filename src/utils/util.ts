import { getValueFor } from 'store/secureStore';
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
  let result = null;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const today = new Date();
  const delta = today.getTime() - date.getTime();

  let differSec = delta / 1000;

  if (differSec < 1) {
    return (result = '방금');
  }
  if (differSec < 60) {
    return (result = `${Math.floor(differSec)}초 전`);
  }
  if (differSec < 3600) {
    return (result = `${Math.floor(differSec / 60)}분 전`);
  }
  if (differSec < 24 * 3600) {
    return (result = `${Math.floor(differSec / 3600)}시간 전`);
  }
  if (differSec >= 24 * 3600) {
    return date
      .toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
      })
      .slice(0, 10);
  }

  return result;
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
export function isAcceptedParticipant(paticipants: WorkoutParictipantsRead[]) {
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
  paticipants: WorkoutParictipantsRead[],
  userId: string,
) {
  const requestedParticipants = paticipants.filter(
    participant =>
      (participant.status === 'PENDING' || participant.status === 'ACCEPTED') &&
      participant.userId === userId,
  );

  return requestedParticipants.length !== 0;
}
