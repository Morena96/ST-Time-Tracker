import React from 'react';
import { Box, Inline, Button, Link, Form, useForm } from '@forge/react';
import { invoke } from '@forge/bridge';

const TimerPage = ({ setApiKey }) => {
  const { handleSubmit } = useForm();

  const onResetApiKey = async (data) => {
    console.log(data);
    invoke('resetApiKey').then(result => {
      setApiKey(null);
    });
  };

  return (
    <>
      <Box padding='space.100'></Box>
      <Inline>
        <Box padding='space.200'></Box>
        <Link href="https://teams.scrumlaunch.com/time-tracker" openNewTab={true}>Manage tracked time</Link>
      </Inline>

      <Box padding='space.100'></Box>
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

export default TimerPage; 