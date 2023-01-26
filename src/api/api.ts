import axios from 'axios';
import { UserCreate } from '@type/types';
import FormData from 'form-data';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

const postLogin = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  const res = await api.post('/auth/jwt/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

async function postUser(params: UserCreate) {
  const res = await api.post('/auth/register', params);
  return res;
}

export { postLogin, postUser };
