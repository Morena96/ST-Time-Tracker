import React from 'react';
import { Box, Stack, Heading, xcss,useForm,Button,Inline } from "@forge/react";


const containerStyles = xcss({
  backgroundColor: 'color.background.discovery',
});

const StartTimer = () => {

  const { handleSubmit } = useForm();

  const onTimerStart = async (data) => {
    console.log('timer start');
  };

  return (
    <Stack grow='fill' alignInline='center'>
      <Box padding='space.200'></Box>
      <Heading as="h2">00:00:00</Heading>
      <Box padding='space.200'></Box>

      <Button type='submit' appearance="primary" shouldFitContainer onClick={handleSubmit(onTimerStart)}>
        START TIMER
      </Button>
      <Box padding='space.050'></Box>
    </Stack>
  );
};

export default StartTimer;