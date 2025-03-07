import React from 'react';
import { Box, Stack, Heading, xcss,useForm,Button,Inline } from "@forge/react";
import {useState} from 'react';
import ErrorMessage from './widgets/error_message';

const StartTimer = (onTimerStart) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const { handleSubmit } = useForm();

  const _onTimerStart = async (data) => {
    const result =await onTimerStart();

    if (!result.success) {
      setErrorMessage(result.error);
    }
  };

  return (
    <Stack grow='fill' alignInline='center'>
      <Box padding='space.200'></Box>
      <Heading as="h2">00:00:00</Heading>
      <Box padding='space.200'></Box>

      <Button type='submit' appearance="primary" shouldFitContainer onClick={handleSubmit(_onTimerStart)}>
        START TIMER
      </Button>
      <Box padding='space.050'></Box>

      {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />}
      {errorMessage && <Box padding='space.050'></Box>}

    </Stack>
  );
};

export default StartTimer;