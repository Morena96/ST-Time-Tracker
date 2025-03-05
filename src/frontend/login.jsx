import React, { useState } from 'react';
import { Box, Inline, Text, Textfield, Button, Link, Form, useForm } from '@forge/react';
import { siteUrl } from './utils/app_constants';

const LoginPage = ({ fetchActiveTimer }) => {
    const { register, handleSubmit } = useForm();

    const [value, setValue] = useState('');

    const onSubmitApiKey = async (data) => {
        var result = await fetchActiveTimer(value);

        if (!result) 
            setValue('');
        
    };

    const url = siteUrl + '/profile';

    return (
        <Form onSubmit={handleSubmit(onSubmitApiKey)}>
            <Inline>
                <Box padding='space.200'></Box>
                <Text>Enter your ScrumTeams API key:</Text>
            </Inline>
            <Box padding='space.050'></Box>
            <Inline alignBlock='center'>
                <Box padding='space.200'></Box>
                <Textfield {...register('apiKey')} value={value} onChange={(e) => setValue(e.target.value)}></Textfield>
                <Box padding='space.050'></Box>
                <Button type='submit'>Update</Button>
                <Box padding='space.200'></Box>
            </Inline>
            <Box padding='space.050'></Box>
            <Inline>
                <Box padding='space.200'></Box>
                <Link href={url} openNewTab={true}>Get API key</Link>
            </Inline>
        </Form>
    );
};

export default LoginPage;
