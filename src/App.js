import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './navigation';
import SummaSplashScreen from './components/SummaSplashScreen';
import { persistor, store } from './store';
// Initialize Apollo Client
const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setIsAppReady(true);
  }, []);

  return (
    <SummaSplashScreen isAppReady={isAppReady}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    </SummaSplashScreen>
  );
};

export default App;
