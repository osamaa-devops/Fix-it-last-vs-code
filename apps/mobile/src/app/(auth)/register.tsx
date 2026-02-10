import RegisterScreen from '../../screens/RegisterScreen';
import { useNavigation } from 'expo-router';
import React from 'react';

export default function RegisterRoute() {
  const navigation = useNavigation();
  return <RegisterScreen navigation={navigation} />;
}
