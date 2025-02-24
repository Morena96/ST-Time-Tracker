import React from 'react';
import { Box, Inline, Text, Textfield, Button, Link, Form, useForm } from '@forge/react';

const LoginPage = ({ checkApiKey }) => {
    const { register, handleSubmit } = useForm();

    const onSubmitApiKey = async (data) => {
        checkApiKey(data.apiKey);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmitApiKey)}>
            <Inline>
                <Box padding='space.200'></Box>
                <Text>Enter your ScrumTeams API key:</Text>
            </Inline>
            <Box padding='space.100'></Box>
            <Inline alignBlock='center'>
                <Box padding='space.200'></Box>
                <Textfield {...register('apiKey')}></Textfield>
                <Box padding='space.100'></Box>
                <Button type='submit'>Update</Button>
                <Box padding='space.200'></Box>
            </Inline>
            <Box padding='space.100'></Box>
            <Inline>
                <Box padding='space.200'></Box>
                <Link href="https://teams.scrumlaunch.com/settings" openNewTab={true}>Get API key</Link>
            </Inline>
        </Form>
    );
};

export default LoginPage;
