import React, { useEffect, useState } from 'react';
import ForgeReconciler from '@forge/react';
import { invoke } from '@forge/bridge';
import { Stack, Box, Button, Text, Strong } from '@forge/react';
import LoginPage from './login';
import Scaffold from './scaffold';
import TimeEntry from './models/time_entry';
import Loader from './widgets/loader';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  const fetchActiveTimer = async (apiKey) => {
    try {
      const result = await invoke('getRemoteActiveTimer', { 'apiKey': apiKey });
      console.log('Invoke result:', result);
      
      if (result.success) {
        localStorage.setItem('apiKey', apiKey);
        setNetworkError(null); // Clear any previous network errors
        const activeTimer = result.activeTimer;
        for (const timeEntry of activeTimer.time_entries) {
          if (timeEntry.end_date === null) {
            setActiveTimer(new TimeEntry(timeEntry.id, timeEntry.project ? timeEntry.project.id : null, timeEntry.start_date, timeEntry.end_date, timeEntry.start_date, timeEntry.description, timeEntry.tags ? timeEntry.tags.split(',').map(tag => tag.trim()) : []));
            break;
          }
        }
        setIsLoggedIn(true);
      } else {
        // Check if it's an authentication/authorization error
        if (result.statusCode === 401 || result.statusCode === 403) {
          localStorage.removeItem('apiKey');
          setIsLoggedIn(false);
          setNetworkError(null);
        } else {
          // For other errors, keep the user logged in but show network error
          console.log('Setting network error:', result);
          setNetworkError({
            message: 'Something went wrong. Please check your network connection and try again.',
            statusCode: result.statusCode || 'Unknown',
            error: result.error
          });
          setIsLoggedIn(true); // Keep user logged in
        }
        console.log('error', result.error);
        console.log('statusCode', result.statusCode);
      }
      return result.success;
    } catch (invokeError) {
      // Handle invoke errors
      console.log('Invoke error:', invokeError);
      setNetworkError({
        message: 'Something went wrong. Please check your network connection and try again.',
        statusCode: 'Unknown',
        error: invokeError.message || 'Invoke error occurred'
      });
      setIsLoggedIn(true); // Keep user logged in
      return false;
    }
  };

  const resetApiKey = async () => {
    localStorage.removeItem('apiKey');
    setIsLoggedIn(false);
  };

  const handleReload = async () => {
    setNetworkError(null);
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      await fetchActiveTimer(apiKey);
    }
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      setNetworkError(null); // Clear any previous network errors
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
    if (networkError) {
      return (
        <Stack grow='fill' space='space.200'>
          <Box padding='space.300'>
            <Stack space='space.200'>
              <Text>
                <Strong>Connection Error</Strong>
              </Text>
              <Text>
                {networkError.message}
              </Text>
              {networkError.statusCode && (
                <Text>
                  Status Code: {networkError.statusCode}
                </Text>
              )}
              <Button 
                appearance="primary" 
                onClick={handleReload}
                shouldFitContainer
              >
                Reload
              </Button>
              <Button 
                appearance="subtle" 
                onClick={resetApiKey}
                shouldFitContainer
              >
                Reset API Key
              </Button>
            </Stack>
          </Box>
        </Stack>
      );
    }
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
