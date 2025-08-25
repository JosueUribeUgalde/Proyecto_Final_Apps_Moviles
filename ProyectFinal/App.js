import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { PasswordResetScreen } from './src/screens';

export default function App() {
  return (
    <>
      <PasswordResetScreen />
      <StatusBar style="auto" />
    </>
  );
}
