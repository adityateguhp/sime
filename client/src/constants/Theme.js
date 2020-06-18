import { DefaultTheme } from 'react-native-paper';
import Colors from './Colors';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primaryColor,
    secondary: Colors.secondaryColor,
    error: '#f13a59',
  },
};
