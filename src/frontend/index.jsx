import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Inline, Text,Textfield,Button,Link } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);
  return (
    <>
      <Inline>
      <Box padding='space.200'> </Box>
      <Text>Enter your ScrumTeams API key:</Text>
      </Inline>
      <Box padding='space.100'> </Box>
      <Inline  alignBlock='center'>
      <Box padding='space.200'> </Box>
      <Textfield></Textfield>
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
