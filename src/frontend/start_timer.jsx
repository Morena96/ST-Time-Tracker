import React, { useEffect } from 'react';
import { Box, Stack, Heading, useForm, Button, LoadingButton, Inline } from "@forge/react";
import { useState } from 'react';
import ErrorMessage from './widgets/error_message';
import SuccessMessage from './widgets/success_message';

const StartTimer = ({ onTimerStart, successMessage: propSuccessMessage, errorMessage: propErrorMessage }) => {
  const [errorMessage, setErrorMessage] = useState(propErrorMessage);
  const [successMessage, setSuccessMessage] = useState(propSuccessMessage);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit } = useForm();

  useEffect(() => {
    setSuccessMessage(propSuccessMessage);
  }, [propSuccessMessage]);

  useEffect(() => {
    setErrorMessage(propErrorMessage);
  }, [propErrorMessage]);

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
      {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage(null)} />}
      {errorMessage && <Box padding='space.050'></Box>}

    </Stack>
  );
};

export default StartTimer;