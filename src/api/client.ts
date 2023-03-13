import { useAuthActions } from 'hooks/context/useAuth';
import { getValueFor } from 'store/secureStore';
import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { refreshAccessToken } from './api';
export const BASE_URL =
  Platform.OS === 'ios'
    ? 'http://127.0.0.1:8000/api/v1'
    : 'http://10.0.2.2:8000/api/v1';
type RequestCallback = (token: string) => void;
const apiClient = applyCaseMiddleware(axios.create({ baseURL: BASE_URL }));
// const REFRESH_URL = '/auth/refresh';
apiClient.defaults.withCredentials = true;
// apiClient.defaults.xsrfCookieName = 'csrftoken';
// apiClient.defaults.xsrfHeaderName = 'X-CSRFToken';

function useAxiosInterceptor() {
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);

  const authActions = useAuthActions();

  let refreshSubscribers: RequestCallback[] = useMemo(() => [], []);

  const onTokenRefreshed = useCallback(
    (token: string) => {
      refreshSubscribers.map((cb: RequestCallback) => {
        cb(token);
      });
    },
    [refreshSubscribers],
  );

  const addRefreshSubscriber = useCallback(
    (cb: RequestCallback) => {
      refreshSubscribers.push(cb);
    },
    [refreshSubscribers],
  );

  apiClient.interceptors.request.use(
    async config => {
      const originalRequest = config;
      const tokenData = getValueFor('token');
      if (tokenData) {
        originalRequest.headers.Authorization = `Bearer ${tokenData}`;
      }
      return originalRequest;
    },
    error => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    response => response,
    async error => {
      const {
        config,
        response: { status },
      } = error;
      const originalRequest = config;

      // if (!config || !status) {
      //   return Promise.reject(error);
      // }
      // if (config.url === REFRESH_URL || status !== 401) {
      //   return Promise.reject(error);
      // }
      // token이 재발급 되는 동안의 요청은 refreshSubscribers에 저장
      const retryOriginalRequest = new Promise((resolve, reject) => {
        addRefreshSubscriber((token: string) => {
          try {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            console.log('retryOriginalRequest: ', originalRequest);
            resolve(apiClient(originalRequest));
          } catch (err) {
            console.log('retryOriginalRequest err: ', err);
            reject(err);
          }
        });
      });
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        if (!isTokenRefreshing) {
          // isTokenRefreshing이 false인 경우에만 token refresh 요청
          setIsTokenRefreshing(true);
          try {
            const data = await refreshAccessToken({
              token: getValueFor('token'),
              refreshToken: getValueFor('refreshToken'),
            });
            const { token: newAccessToken, refreshToken: newRefresh } = data;
            authActions.refreshToken(newAccessToken, newRefresh);
            // 새로운 토큰 저장
            setIsTokenRefreshing(false);
            // 새로운 토큰으로 지연되었던 요청 진행
            onTokenRefreshed(newAccessToken);
          } catch (err: any) {
            setIsTokenRefreshing(false);
            if (err?.response?.status === 401) {
              // refresh token이 만료된 경우 로그아웃
              Alert.alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
              authActions.signOut();
            }
          }
        }

        return retryOriginalRequest;
      }
      return Promise.reject(error);
    },
  );

  return null;
}

export { apiClient, useAxiosInterceptor };
