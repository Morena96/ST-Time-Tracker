import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Inline, Text, Textfield, Button, Link } from '@forge/react';
import { invoke } from '@forge/bridge';
import { storage } from '@forge/api';

const App = () => {

  console.log("atabay");

  const handleApiKeyChange = async (e) => {
    await storage.set('apiKey', e.target.value);
  };

  return (
    <>
      <Inline>
        <Box padding='space.200'> </Box>
        <Text>Enter your ScrumTeams API key:</Text>
      </Inline>
      <Box padding='space.100'> </Box>
      <Inline alignBlock='center'>
        <Box padding='space.200'> </Box>
        <Textfield onChange={handleApiKeyChange}></Textfield>
        <Box padding='space.100'> </Box>
        <Button>Update</Button>
        <Box padding='space.200'> </Box>
      </Inline>
      <Box padding='space.100'> </Box>
      <Inline>
        <Box padding='space.200'> </Box>
        <Link href="https://atlassian.com" openNewTab={true}>Get API key</Link>
      </Inline>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
