import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { debounce } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import saveFileManager from '../../utils/SaveFileManager';
import FloorplanNavigator from '../FloorplanNavigator';
import ProjectNavigator from '../ProjectNavigator';

import { submitFixturesAction } from '../../store/features/fixture/action';

import { Gear, Stack } from 'phosphor-react-native';

const styles = StyleSheet.create({
  homeTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

const Tab = createBottomTabNavigator();

// Home bottom tabs
const tabs = [
  {
    name: 'Floorplans',
    component: FloorplanNavigator,
    icon: <Stack size={30} color={'#fff'} />,
    focusedIcon: <Stack size={30} color={'#fff'} weight="fill" />,
  },
  {
    name: 'Project',
    component: ProjectNavigator,
    icon: <Gear size={30} color={'#fff'} />,
    focusedIcon: <Gear size={30} color={'#fff'} weight="fill" />,
  },
];

const BottomTabNavigator = ({
  projectKey,
  installerKey,
  navigation,
  cleanupAndLoadUnsavedFixtures,
  hasInternet,
  unsavedFixtures,
  submitFixtures,
  logoutAction,
  setUnsaveProjectInfo,
  projectIds,
}) => {
  useEffect(() => {
    if (!projectKey || !installerKey) {
      if (!projectIds.length) {
        navigation.navigate('ProjectScanner');
      } else {
        navigation.popToTop();
      }
    }
  }, [projectKey, installerKey, navigation, projectKey]);

  useEffect(() => {
    return () => {
      logoutAction();
    };
  }, [logoutAction]);

  // load the unsaved data
  useEffect(() => {
    if (projectKey) {
      // Load unsaved fixtures when project is loaded
      saveFileManager.projectKey = projectKey;
      saveFileManager.onLoaded = (fixtures, project) => {
        cleanupAndLoadUnsavedFixtures({ fixtures });
        setUnsaveProjectInfo(project);
      };
    }
  }, [projectKey, cleanupAndLoadUnsavedFixtures, setUnsaveProjectInfo]);

  const updateFixtures = useCallback(
    async (fixtures) => {
      const submit = await submitFixtures(fixtures);
      if (submit.type === submitFixturesAction.fulfilled.toString()) {
        saveFileManager.clearFixtures();
      } else {
        saveFileManager.saveFixtures(fixtures);
      }
    },
    [submitFixtures],
  );

  const debounceUpdateFixtures = useCallback(
    debounce((fixtures) => {
      updateFixtures(fixtures);
    }, 500),
    [updateFixtures],
  );

  // handle saving fixture when online and offline
  useEffect(() => {
    if (!projectKey) {
      return;
    }

    if (hasInternet && unsavedFixtures.length) {
      debounceUpdateFixtures(unsavedFixtures);
    }
  }, [projectKey, hasInternet, unsavedFixtures, debounceUpdateFixtures]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#000',
          height: 80,
          width: '100%',
        },
      }}
      initialRouteName={'Floorplans'}>
      {tabs.map((el, index) => (
        <Tab.Screen
          key={index}
          name={el.name}
          component={el.component}
          initialParams={{ header: el.name }}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.homeTabItem} accessibilityLabel={`bottom-tab-${el.name}`}>
                {focused ? el.focusedIcon : el.icon}
                <Text
                  style={{ color: '#fff', width: '100%', fontWeight: focused ? 'bold' : 'normal' }}>
                  {el.name}
                </Text>
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
