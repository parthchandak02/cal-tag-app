import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const colorScheme = useColorScheme();

  const theme = {
    dark: {
      background: '#121212',
      surface: '#1E1E1E',
      card: '#2C2C2C', // New color for card background in dark mode
      primary: '#BB86FC',
      secondary: '#03DAC6',
      text: '#FFFFFF',
      textSecondary: '#B3B3B3',
      border: '#3A3A3A', // New color for card borders in dark mode
      highlight: '#2C2C2C',
    },
    light: {
      background: '#FFFFFF',
      surface: '#F5F5F5',
      card: '#FFFFFF', // New color for card background in light mode
      primary: '#6200EE',
      secondary: '#03DAC6',
      text: '#000000',
      textSecondary: '#666666',
      border: '#E0E0E0', // New color for card borders in light mode
      highlight: '#E0E0E0',
    },
  };

  const activeTheme = colorScheme === 'dark' ? theme.dark : theme.light;

  const fontConfig = {
    regular: {
      fontFamily: 'Montserrat',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Montserrat',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'Montserrat',
      fontWeight: '700',
    },
    italic: {
      fontFamily: 'Montserrat-Italic',
      fontWeight: '400',
    },
  };

  return {
    colors: activeTheme,
    fonts: {
      regular: {
        ...fontConfig.regular,
        fontSize: 16,
      },
      medium: {
        ...fontConfig.medium,
        fontSize: 16,
      },
      large: {
        ...fontConfig.bold,
        fontSize: 20,
      },
      italic: {
        ...fontConfig.italic,
        fontSize: 16,
      },
    },
    fontConfig,
  };
};
