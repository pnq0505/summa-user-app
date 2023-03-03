import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Home Screens
import FloorplanDetail from '../../screens/FloorplanDetail';
import Floorplans from '../../screens/Floorplans';

const FloorplanStack = createNativeStackNavigator();

const routes = [
  { name: 'FloorplanList', component: Floorplans },
  { name: 'FloorplanDetail', component: FloorplanDetail },
];

const StackNavigator = ({ routes, initialRouteName }) => {
  const stackScreen = routes.map((route, index) => (
    <FloorplanStack.Screen key={index} name={route.name} component={route.component} />
  ));

  return (
    <FloorplanStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}>
      {stackScreen}
    </FloorplanStack.Navigator>
  );
};

const FloorplanNavigator = () => {
  return <StackNavigator routes={routes} initialRouteName={'FloorplanList'} />;
};

export default FloorplanNavigator;
