import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/auth';

function AuthStackLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}
      >
        <Stack.Screen
          name="loading"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="(dashboard)"
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthStackLayout />
    </AuthProvider>
  );
}

