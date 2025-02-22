import React from 'react';
import { Box, Inline, Button, Link, Form, useForm,xcss, Stack, Text } from '@forge/react';
import { invoke } from '@forge/bridge';

const containerStyles = xcss({
  border: '1px solid #ccc',
  backgroundColor: 'elevation.surface.raised',
  boxShadow: 'elevation.shadow.raised',
  padding: 'space.200',
  borderRadius: 'border.radius',
});

const TrackerPage = ({ setApiKey }) => {
  const { handleSubmit } = useForm();

  const onResetApiKey = async (data) => {
    console.log(data);
    invoke('resetApiKey').then(result => {
      setApiKey(null);
    });
  };

  return (
    <>
      <Box xcss={containerStyles}>

        <Stack space="space.100">
          <Text>
            Apply Atlassian design tokens and styling through xCSS
          </Text>
        
        </Stack>
      </Box>

      
      <Box padding='space.100'></Box>
      <Inline>
        <Box padding='space.200'></Box>
        <Link href="https://teams.scrumlaunch.com/time-tracker" openNewTab={true}>Manage tracked time</Link>
      </Inline>
      <Form onSubmit={handleSubmit(onResetApiKey)}>
        <Inline>
          <Box padding='space.200'></Box>
          <Button type='submit' appearance="primary" onClick={handleSubmit(onResetApiKey)}>   
            Reset API key
          </Button>
        </Inline>
      </Form>
    </>
  );
};

export default TrackerPage; 