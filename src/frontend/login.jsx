import React from 'react';
import { Box, Inline, Text, Textfield, Button, Link, Form, useForm } from '@forge/react';
import { invoke } from '@forge/bridge';

const LoginPage = ({ setApiKey }) => {
    const { register, handleSubmit } = useForm();

    const onSubmitApiKey = async (data) => {
        console.log(data);
        invoke('storeApiKey', { apiKey: data.apiKey }).then(result => {
            setApiKey(data.apiKey);
        });
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
