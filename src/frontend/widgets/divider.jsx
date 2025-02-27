import { Box, xcss, Stack } from '@forge/react';
import React from 'react';


const Divider = () => {

  const dividerStyles = xcss({
    width: '100%',
    height: '1px',
  });

  return (
    <Stack grow='fill' alignInline='center'>
      <Box padding='space.100'></Box>
      <Box backgroundColor='color.background.accent.gray.bolder.pressed' xcss={dividerStyles}>   </Box>
      <Box padding='space.100'></Box>
    </Stack>
  );
};

export default Divider;