import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Login from '../../screens/Login';
import ProjectScanner from '../../screens/Login/ProjectScanner';
import Projects from '../../screens/Projects';
import BottomTabNavigator from '../BottomTabNavigator';

const Stack = createNativeStackNavigator();

const routes = [
  { name: 'Login', component: Login },
  { name: 'Projects', component: Projects },
  { name: 'ProjectScanner', component: ProjectScanner },
  { name: 'BottomTab', component: BottomTabNavigator },
];

const StackNavigator = ({ routes, initialRouteName }) => {
  const stackScreen = routes.map((route) => (
    <Stack.Screen key={route.name} name={route.name} component={route.component} />
  ));
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      {stackScreen}
    </Stack.Navigator>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.color,
    background: 'transparent',
  },
};

const Route = () => {
  return (
    <NavigationContainer theme={theme}>
      <StackNavigator routes={routes} initialRouteName={'Projects'} />
    </NavigationContainer>
  );
};

export default Route;
