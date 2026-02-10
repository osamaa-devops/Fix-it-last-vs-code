import LoginScreen from '../../screens/LoginScreen';
import { useNavigation } from 'expo-router';
import React from 'react';

export default function LoginRoute() {
  const navigation = useNavigation();
  return <LoginScreen navigation={navigation} />;
}
