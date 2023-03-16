import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from 'react';
import { Snackbar, Text, useTheme } from 'react-native-paper';

type AlertStatus = 'success' | 'error' | 'warning' | 'info';

type SnackBarState = {
  visible: boolean;
  message: string;
  status: AlertStatus;
};

type SnackBarActions = {
  onShow: (message: string, status?: AlertStatus) => void;
  onDismiss: () => void;
};

const initialSnackBarState: SnackBarState = {
  visible: false,
  message: '',
  status: 'info',
};

const initialSnackBarActions: SnackBarActions = {
  onShow: () => {},
  onDismiss: () => {},
};

const SnackBarValueContext = createContext<SnackBarState>(initialSnackBarState);
const SnackBarActionsContext = createContext<SnackBarActions>(
  initialSnackBarActions,
);

type SnackBarProviderProps = PropsWithChildren;

export default function SnackBarProvider({ children }: SnackBarProviderProps) {
  const [snackBarState, setSnackBarState] =
    useState<SnackBarState>(initialSnackBarState);

  const snackBarActions = useMemo(
    () => ({
      onShow: (message: string, status: AlertStatus = 'info') => {
        setSnackBarState({
          visible: true,
          message,
          status,
        });
      },
      onDismiss: () => {
        setSnackBarState(prev => ({
          ...prev,
          visible: false,
        }));
      },
    }),
    [],
  );

  const theme = useTheme();

  const style = useMemo(() => {
    switch (snackBarState.status) {
      case 'success':
        return {
          backgroundColor: theme.colors.primaryContainer,
          textColor: theme.colors.onPrimaryContainer,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error,
          textColor: theme.colors.onError,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.errorContainer,
          textColor: theme.colors.onErrorContainer,
        };
      case 'info':
        return {
          backgroundColor: theme.colors.surfaceVariant,
          textColor: theme.colors.onSurfaceVariant,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          textColor: theme.colors.onSurface,
        };
    }
  }, [snackBarState.status, theme.colors]);

  return (
    <SnackBarActionsContext.Provider value={snackBarActions}>
      <SnackBarValueContext.Provider value={snackBarState}>
        {children}
        <Snackbar
          visible={snackBarState.visible}
          onDismiss={snackBarActions.onDismiss}
          duration={3000}
          style={{ backgroundColor: style.backgroundColor }}
          action={{
            labelStyle: { color: style.textColor },
            label: '확인',
            onPress: () => {
              snackBarActions.onDismiss();
            },
          }}>
          <Text style={{ color: style.textColor }}>
            {snackBarState.message}
          </Text>
        </Snackbar>
      </SnackBarValueContext.Provider>
    </SnackBarActionsContext.Provider>
  );
}

export { SnackBarValueContext, SnackBarActionsContext };
