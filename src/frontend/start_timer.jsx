import React from 'react';
import {Box, Stack,Heading,Inline,xcss} from "@forge/react";


const containerStyles = xcss({

  backgroundColor: 'color.background.discovery',
  width:"100%",
  height:"100%",
});

const StartTimer = () => {
  return (
    <Stack alignBlock='center' alignInline='center'>

      <Box xcss={containerStyles}>
        <Heading as="h2">00:00:01</Heading>
      </Box>
    </Stack>
  );
};

export default StartTimer;