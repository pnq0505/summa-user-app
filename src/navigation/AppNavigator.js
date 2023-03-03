import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { graphql_query_fixtures, SocketClient } from '../store/api/graphql-socket';
import Route from './Route';

import offlineDataManager from '../utils/OfflineDataManager';

const AppNavigator = ({
  wsUrl,
  setInternetConnectionStatus,
  logoutAction,
  loadOfflineFixturesForPloorlan,
  syncLiveUpdatedFixtures,
  updateFixtureStatusQuantityFromSocket,
}) => {
  const [isSocketConnected, setIsSocketConnected] = useState(null);

  // Offline data can be loaded when the app started.
  useEffect(() => {
    offlineDataManager.onLoaded = (fixtures, floorplanIds) => {
      floorplanIds.forEach((fid) => {
        loadOfflineFixturesForPloorlan({ fixtures: fixtures[fid] || [], floorplanKey: fid });
      });
    };
    offlineDataManager.loadFromDisk();
  }, [loadOfflineFixturesForPloorlan]);

  useEffect(() => {
    logoutAction();
  }, [logoutAction]);

  // SUBSCRIPTION FOR REAL-TIME CONNECTION ON FLOORPLAN SCREEN
  useEffect(() => {
    if (!wsUrl) return;

    const client = SocketClient(wsUrl);
    const socket = client.subscribe(graphql_query_fixtures, {
      next: async (data) => {
        const fixtures = data?.data?.observeFixtureChange || null;
        await syncLiveUpdatedFixtures({ fixtures });
        updateFixtureStatusQuantityFromSocket(fixtures?.floorplanKey);
      },
      error: (err) => {
        // ERROR AFTER 10000 ATTEMPS (OPTIONAL)
        console.log(err);
      },
      complete: () => {},
    });
    client.on('connected', () => {
      setIsSocketConnected(true);
    });
    client.on('error', () => {
      setIsSocketConnected(false);
    });
    return () => {
      socket();
    };
  }, [wsUrl, syncLiveUpdatedFixtures]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setInternetConnectionStatus({ status: state.isConnected });
    });

    return () => {
      unsubscribe();
    };
  }, [setInternetConnectionStatus]);

  return <Route />;
};

export default AppNavigator;
