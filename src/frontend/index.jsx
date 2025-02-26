import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Spinner, Stack } from '@forge/react';
import { invoke } from '@forge/bridge';
import LoginPage from './login';
import TrackerPage from './tracker';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const checkApiKey = async (apiKey) => {
    console.log('checkApiKey called with apiKey:', apiKey);
    const result = await invoke('checkApiKey', { 'apiKey': apiKey });
    console.log('checkApiKey result ayayay:', result);
    setIsLoggedIn(result.success);
    return result.success;
  };

  const resetApiKey = async () => {
    await invoke('resetApiKey');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      const result = await invoke('getApiKey');
      console.log('fetchApiKey result:', result.apiKey);
      if (result.apiKey) {
        checkApiKey(result.apiKey);
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchApiKey();
  }, []);

  if (isLoggedIn) {
    return <TrackerPage resetApiKey={resetApiKey} />;
  } else if (isLoggedIn===false ) {
    return <LoginPage checkApiKey={checkApiKey} />;
  } else {
    return <Stack alignBlock="center" alignInline="center"> <Spinner size="medium" label="loading" /> </Stack>
  }
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
