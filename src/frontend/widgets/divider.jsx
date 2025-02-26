import { Box, xcss, Stack } from '@forge/react';
import React from 'react';

const dividerStyles = xcss({
  color: 'color.text.accent.gray',
  width: '100%',
  height: '3px',
});

const Divider = () => {

  return (
    <Stack>
      <Box padding='space.100'></Box>
      <Box xcss={dividerStyles}></Box>
      <Box padding='space.100'></Box>
    </Stack>
  );
};

export default Divider;