import React, { useEffect, useState } from 'react';
import ForgeReconciler from '@forge/react';
import { invoke } from '@forge/bridge';
import LoginPage from './login';
import TrackerPage from './tracker';

const App = () => {
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    const fetchApiKey = async () => {
       invoke('getApiKey').then(result => {
        setApiKey(result.apiKey);
       });
    };
    fetchApiKey();
  }, []);

  if (apiKey === null) {
    return <LoginPage setApiKey={setApiKey} />;
  } else {
    return <TrackerPage setApiKey={setApiKey} />;
  }
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
