import React, { useEffect, useState } from 'react';
import ForgeReconciler from '@forge/react';
import { invoke } from '@forge/bridge';
import LoginPage from './login';
import TrackerPage from './tracker';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkApiKey = async (apiKey) => {
    const result = await invoke('checkApiKey', { 'apiKey': apiKey });
    setIsLoggedIn(result.success);
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      const result = await invoke('getApiKey');
      if (result.apiKey) {
        checkApiKey(result.apiKey);
      }
    };

    fetchApiKey();
  }, []);

  if (isLoggedIn) {
    return <TrackerPage resetApiKey={resetApiKey} />;
  } else {
    return <LoginPage checkApiKey={checkApiKey} />;
  }
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
