import { Platform } from 'react-native';
import React, { useCallback } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useTheme } from 'react-native-paper';

export type DatePickerState = {
  date: Date;
  mode: DatePickerMode;
  visible: boolean;
};
type Props = {
  state: DatePickerState;
  setState: React.Dispatch<React.SetStateAction<DatePickerState>>;
};

const DateTimeModal = ({ state, setState }: Props) => {
  const theme = useTheme();
  // date picker
  const { date, mode, visible } = state;

  const display =
    Platform.OS === 'ios' && (mode === 'date' || mode === 'datetime')
      ? 'inline'
      : 'spinner';

  const onConfirm = useCallback(
    (selectedDate: Date) => {
      setState(prev => ({ ...prev, visible: false }));
      if (mode === 'date') {
        selectedDate.setHours(date.getHours());
        setState(prev => ({ ...prev, date: selectedDate }));
      } else if (mode === 'time') {
        selectedDate.setFullYear(date.getFullYear());
        selectedDate.setMonth(date.getMonth());
        selectedDate.setDate(date.getDate());
        setState(prev => ({ ...prev, date: selectedDate }));
      } else if (mode === 'datetime') {
        setState(prev => ({ ...prev, date: selectedDate }));
      }
    },
    [date, mode, setState],
  );

  const onCancel = useCallback(() => {
    setState(prev => ({ ...prev, visible: false }));
  }, [setState]);

  return (
    <DateTimePickerModal
      date={date}
      isVisible={visible}
      display={display}
      isDarkModeEnabled={theme.dark}
      minuteInterval={10}
      mode={mode}
      onConfirm={onConfirm}
      onCancel={onCancel}
      cancelTextIOS="취소"
      confirmTextIOS="확인"
      buttonTextColorIOS={theme.colors.primary}
      minimumDate={new Date()}
    />
  );
};

export default DateTimeModal;
