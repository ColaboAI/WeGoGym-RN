import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import { Snackbar, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AlertStatus = 'success' | 'error' | 'warning' | 'info';

type SnackBarState = {
  visible: boolean;
  message: string;
  status: AlertStatus;
  isBottom: boolean;
};

type SnackBarActions = {
  onShow: (message: string, status?: AlertStatus, isBottom?: boolean) => void;
  onDismiss: () => void;
};

const initialSnackBarState: SnackBarState = {
  visible: false,
  message: '',
  status: 'info',
  isBottom: true,
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
      onShow: (
        message: string,
        status: AlertStatus = 'info',
        isBottom = true,
      ) => {
        setSnackBarState({
          visible: true,
          message,
          status,
          isBottom,
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
  const inset = useSafeAreaInsets();

  const wrapperStyle = useMemo(() => {
    if (snackBarState.isBottom) {
      return styles.isBottom;
    } else {
      return [{ marginTop: inset.top }, styles.isTop];
    }
  }, [inset.top, snackBarState.isBottom]);

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
          wrapperStyle={wrapperStyle}
          style={{ backgroundColor: style.backgroundColor, zIndex: 1000 }}
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

const styles = StyleSheet.create({
  isBottom: {
    position: 'absolute',
    bottom: 0,
  },
  isTop: {
    position: 'absolute',
    top: 0,
  },
});
