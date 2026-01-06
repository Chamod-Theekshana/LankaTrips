import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: '#1e293b',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    surface: colors.surface,
    background: colors.background,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
  },
};