import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CategoriesScreen } from './CategoriesScreen';
import { HandymenScreen } from './HandymenScreen';
import { HandymanProfileScreen } from './HandymanProfileScreen';
import { CreateRequestScreen } from './CreateRequestScreen';
import { OrdersScreen } from './OrdersScreen';

const Stack = createNativeStackNavigator();

export function CustomerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: '#f9fafb' },
      }}
    >
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Handymen" component={HandymenScreen} />
      <Stack.Screen name="HandymanProfile" component={HandymanProfileScreen} />
      <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
    </Stack.Navigator>
  );
}
