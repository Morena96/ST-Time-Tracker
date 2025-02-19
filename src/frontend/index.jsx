import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Inline, Text, Textfield, Button, Link,useForm,Form } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [apiKey, setApiKey] = useState(null); // Initialize state for API key

  useEffect(() => {
    // Fetch API key from the Forge function
    const fetchApiKey = async () => {
       invoke('getApiKey').then(result => {
        setApiKey(result.apiKey);
       });
    };
    fetchApiKey();
  }, []);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    invoke('storeApiKey', { apiKey: data.apiKey }).then(result => {
      setApiKey(data.apiKey);
    });
  };

  const result = (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Inline>
        <Box padding='space.200'></Box>
        <Text>Enter your ScrumTeams API key:</Text>
      </Inline>
      <Box padding='space.100'></Box>
      <Inline alignBlock='center'>
        <Box padding='space.200'></Box>
        <Textfield {...register('apiKey')}></Textfield>
        <Box padding='space.100'></Box>
        <Button type='submit'>Update</Button>
        <Box padding='space.200'></Box>
      </Inline>
      <Box padding='space.100'></Box>
      <Inline>
        <Box padding='space.200'></Box>
        <Link href="https://atlassian.com" openNewTab={true}>Get API key</Link>
      </Inline>
      </Form>
  );

  // Render the API key or the input form based on its presence
  if (apiKey === null) {
    return result;
  } else {
    return <Text>API key is set to {apiKey}</Text>;
  }
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
