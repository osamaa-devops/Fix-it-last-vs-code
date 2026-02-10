import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
          presentation: 'modal',
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: false,
          presentation: 'modal',
          animationEnabled: true,
        }}
      />
    </Stack>
  );
}
