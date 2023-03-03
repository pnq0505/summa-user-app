import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import ProjectInformation from '../../screens/ProjectInformation';
import EditProjectField from '../../screens/ProjectInformation/EditProjectField';
import GateWayScanner from '../../screens/ProjectInformation/GateWayScanner';

const ProjectStack = createNativeStackNavigator();

const routes = [
  { name: 'ProjectInformation', component: ProjectInformation },
  { name: 'EditProjectField', component: EditProjectField },
  { name: 'GateWayScanner', component: GateWayScanner },
];

const StackNavigator = ({ routes, initialRouteName }) => {
  const stackScreen = routes.map((route, index) => (
    <ProjectStack.Screen key={index} name={route.name} component={route.component} />
  ));

  return (
    <ProjectStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}>
      {stackScreen}
    </ProjectStack.Navigator>
  );
};

const ProjectNavigator = () => {
  return <StackNavigator routes={routes} initialRouteName={'ProjectInformation'} />;
};

export default ProjectNavigator;
