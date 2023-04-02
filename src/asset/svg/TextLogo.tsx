import React from 'react';
import { useTheme } from 'react-native-paper';
import { WithLocalSvg } from 'react-native-svg';

export default function TextLogo() {
  const theme = useTheme();
  if (theme.dark) {
    return <WithLocalSvg asset={require('./darkLogo.svg')} width={100} />;
  }

  return <WithLocalSvg asset={require('./lightLogo.svg')} width={100} />;
}
