import DashboardScreen from '../../screens/DashboardScreen';
import { useNavigation } from 'expo-router';
import React from 'react';

export default function HomeRoute() {
  const navigation = useNavigation();
  return <DashboardScreen navigation={navigation} />;
}
