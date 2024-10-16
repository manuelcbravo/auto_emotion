import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, createContext, useContext } from 'react';
import { SessionProvider } from './ctx';
import StackNavigator from './src/StackNavigator';
import { ThemeProvider } from './scripts/ThemeContext'; // Importa el nuevo ThemeProvider
import { AlertNotificationRoot } from 'react-native-alert-notification';

export default function App() {
  return (
    <ThemeProvider>
        <NavigationContainer>
          <AlertNotificationRoot theme='light'>
            <SessionProvider>
              <StackNavigator />
            </SessionProvider>
          </AlertNotificationRoot>
        </NavigationContainer>
    </ThemeProvider>
  );
}
