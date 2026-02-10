import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen';
import { useNavigation } from 'expo-router';
import React from 'react';

export default function ForgotPasswordRoute() {
  const navigation = useNavigation();
  return <ForgotPasswordScreen navigation={navigation} />;
}
