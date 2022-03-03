import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../screens/LoginScreen';
import HomeScreen from '../../screens/HomeScreen';
import ChatScreen from '../../screens/ChatScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      headerMode={'none'}
      mode={'card'}
      screenOptions={{
        header: null,
        cardOverlayEnabled: true,
        cardShadowEnabled: false,
        animationEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name={'login'} component={LoginScreen} />
      <Stack.Screen name={'home'} component={HomeScreen} />
      <Stack.Screen name={'chat'} component={ChatScreen} />
    </Stack.Navigator>
  );
};

export { AppStack };
