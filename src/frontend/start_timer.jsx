import React from 'react';
import { Box, Stack, Heading, useForm, Button, LoadingButton, Inline } from "@forge/react";
import { useState } from 'react';
import ErrorMessage from './widgets/error_message';

const StartTimer = ({ onTimerStart }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit } = useForm();

  const _onTimerStart = async (data) => {
    setIsLoading(true);
    const result = await onTimerStart();

    if (!result.success) {
      setErrorMessage(result.error);
    }

    setIsLoading(false);
  };

  return (
    <Stack grow='fill'>
      <Box padding='space.200'></Box>
      <Inline alignInline='center'>
        <Heading as="h2">00:00:00</Heading>
      </Inline>
      <Box padding='space.200'></Box>

      {isLoading ? (
        <LoadingButton appearance="primary" isLoading shouldFitContainer />
      ) : (
        <Button type='submit' appearance="primary" shouldFitContainer onClick={handleSubmit(_onTimerStart)}>
          START TIMER
        </Button>
      )}
      <Box padding='space.050'></Box>

      {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />}
      {errorMessage && <Box padding='space.050'></Box>}

    </Stack>
  );
};

export default StartTimer;