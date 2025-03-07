import React from 'react';
import ForgeReconciler, { Box, Spinner, Stack } from '@forge/react';

const Loader = () => {
    return (
        <Stack alignInline="center" grow='fill'>
            <Box padding='space.200'></Box>
            <Spinner size="medium" label="loading" />
            <Box padding='space.200'></Box>
        </Stack>
    );
};

export default Loader;