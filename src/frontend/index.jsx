import React, { useEffect, useState } from 'react';
import ForgeReconciler from '@forge/react';
import { invoke } from '@forge/bridge';
import LoginPage from './login';
import Scaffold from './scaffold';
import TimeEntry from './models/time_entry';
import Loader from './widgets/loader';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);

  const fetchActiveTimer = async (apiKey) => {
    const result = await invoke('getRemoteActiveTimer', { 'apiKey': apiKey });
    if (result.success) {
      localStorage.setItem('apiKey', apiKey);
      const activeTimer = result.activeTimer;
      for (const timeEntry of activeTimer.time_entries) {
        if (timeEntry.end_date === null) {
          setActiveTimer(new TimeEntry(timeEntry.id, timeEntry.project ? timeEntry.project.id : null, timeEntry.start_date, timeEntry.end_date, timeEntry.start_date, timeEntry.description, timeEntry.tags ? timeEntry.tags.split(',').map(tag => tag.trim()) : []));
          break;
        }
      }
    } else {
      // Only remove API key for authentication errors, not all errors
      const errorString = typeof result.error === 'string' ? result.error.toLowerCase() : '';
      const isAuthError = errorString.includes('unauthorized') || 
                         errorString.includes('forbidden') || 
                         errorString.includes('invalid token') ||
                         errorString.includes('authentication') ||
                         errorString.includes('invalid key') ||
                         (typeof result.error === 'object' && result.error?.status === 401);
      
      if (isAuthError) {
        setIsLoggedIn(false);
        console.log('Authentication error - removing API key:', result.error);
        localStorage.removeItem('apiKey');
      } else {
        console.log('Non-auth error - keeping API key:', result.error);
        // Don't remove API key for network errors, server errors, etc.
      }
    }

    return result.success;
  };

  const resetApiKey = async () => {
    localStorage.removeItem('apiKey');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      const apiKey = localStorage.getItem('apiKey');
      if (apiKey) {
        fetchActiveTimer(apiKey);
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchApiKey();
  }, []);

  if (isLoggedIn) {
    return <Scaffold resetApiKey={resetApiKey} _activeTimer={activeTimer} />;
  } else if (isLoggedIn === false) {
    return <LoginPage fetchActiveTimer={fetchActiveTimer} />;
  } else {
    return <Loader />
  }
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
