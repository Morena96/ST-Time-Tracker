import React, { useEffect, useState } from 'react';
import ForgeReconciler from '@forge/react';
import { invoke } from '@forge/bridge';
import LoginPage from './login';
import TrackerPage from './tracker';

const App = () => {
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {

    const checkApiKey = async (apiKey) => {
      invoke('checkApiKey', { apiKey: apiKey }).then(result2 => {
        if (result2.success) {
          setApiKey(apiKey);
        }
        else {
          setApiKey(null);
        }
      });

      return apiKey!=null;
    };

    const fetchApiKey = async () => {
      invoke('getApiKey').then(result1 => {
        checkApiKey(result1.apiKey);
      });
    };

    fetchApiKey();
  }, []);

  if (apiKey === null) {
    return <LoginPage checkApiKey={checkApiKey} />;
  } else {
    return <TrackerPage setApiKey={setApiKey} />;
  }
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
