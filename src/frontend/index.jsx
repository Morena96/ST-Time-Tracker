import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Spinner, Stack } from '@forge/react';
import { invoke } from '@forge/bridge';
import LoginPage from './login';
import Scaffold from './scaffold';
import TimeEntry from './models/time_entry';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);

  const fetchActiveTimer = async (apiKey) => {
    const result = await invoke('getRemoteActiveTimer', { 'apiKey': apiKey });
    if (result.success) {
      const activeTimer = result.activeTimer;
      for (const timeEntry of activeTimer.time_entries) {
        if (timeEntry.end_date === null) {
          console.log('timeEntry', timeEntry);
          setActiveTimer(new TimeEntry(timeEntry.id, timeEntry.project_id, timeEntry.start_date, timeEntry.end_date, timeEntry.description, timeEntry.tags));
        }
      }
    }else{
      console.log('error', result.error);
    }
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
        fetchActiveTimer(result.apiKey);
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchApiKey();
  }, []);

  if (isLoggedIn) {
    return <Scaffold resetApiKey={resetApiKey} activeTimer={activeTimer} />;
  } else if (isLoggedIn === false) {
    return <LoginPage fetchActiveTimer={fetchActiveTimer} />;
  } else {
    return <Stack alignInline="center" grow='fill'>
      <Box padding='space.200'></Box>
      <Spinner size="medium" label="loading" />
      <Box padding='space.200'></Box>
    </Stack>
  }
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
