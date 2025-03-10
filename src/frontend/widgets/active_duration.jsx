import { Box, Inline, Heading } from '@forge/react';
import React, { useState, useEffect } from 'react';
import { formatIntToDuration } from '../utils/timeUtils';

const ActiveDuration = ({ start_date }) => {
    const [duration, setDuration] = useState(0);
    useEffect(() => {
        const intervalId = setInterval(() => {
            const diffInMs = new Date().getTime() - new Date(start_date).getTime();
            const diffInSeconds = Math.floor(diffInMs / 1000);
            setDuration(diffInSeconds);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [start_date]);

    return (
        <>
            <Box padding='space.200'></Box>
            <Inline alignInline='center'>
                <Heading as="h2">{formatIntToDuration(duration)}</Heading>
            </Inline>
            <Box padding='space.200'></Box>
        </>
    )
}

export default ActiveDuration;
