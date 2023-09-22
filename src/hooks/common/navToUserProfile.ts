import { useNavigation } from '@react-navigation/native';
import { useAuthValue } from 'hooks/context/useAuth';
import { useCallback } from 'react';

export const useNavigateToUser = (userId: string | undefined) => {
  const nav = useNavigation();
  const authInfo = useAuthValue();
  const navigateToUser = useCallback(() => {
    if (!userId) return;
    if (userId === authInfo?.userId) {
      nav.navigate('MainNavigator', {
        screen: '마이',
        params: {
          screen: 'User',
          params: {
            userId: 'me',
          },
        },
      });
    } else {
      nav.navigate('MainNavigator', {
        screen: '커뮤니티',
        params: {
          screen: 'User',
          params: {
            userId: userId,
          },
        },
      });
    }
  }, [authInfo?.userId, nav, userId]);

  return navigateToUser;
};
