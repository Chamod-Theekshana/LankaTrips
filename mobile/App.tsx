import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { theme } from './src/theme/theme';

function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
              <AppNavigator />
              <Toast />
            </NavigationContainer>
          </AuthProvider>
        </PaperProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default App;
