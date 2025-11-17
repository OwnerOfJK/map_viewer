import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { FriendsProvider } from './context/FriendsContext';
import { ToastProvider } from './context/ToastContext';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <UserProvider>
          <FriendsProvider>
            <ToastProvider>
              <StatusBar style="dark" />
              <AppNavigator />
            </ToastProvider>
          </FriendsProvider>
        </UserProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
