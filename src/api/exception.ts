import { Alert } from 'react-native';

export function handleNetworkErrorMessage(res: Response) {
  let message = '';
  if (res.status === 401) {
    message = '로그인이 만료되었습니다. 다시 로그인해주세요.';
  } else if (res.status === 500) {
    message = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  } else if (res.status === 400) {
    message = '잘못된 요청입니다. 요청 내용을 확인해주세요.';
  } else if (res.status === 404) {
    message = '요청하신 페이지를 찾을 수 없습니다.';
  } else {
    message = '알 수 없는 오류가 발생했습니다.';
  }

  Alert.alert(message, res.statusText);

  return new Error(message + res.statusText);
}
