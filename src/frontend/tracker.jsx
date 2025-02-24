import React from 'react';
import { Box, Inline, Button, Link, Form, useForm, xcss, Stack, Text, Tabs, TabList, Tab, TabPanel } from '@forge/react';
import { invoke } from '@forge/bridge';
import StartTimer from './start_timer';
import ActiveTimer from './active_timer';

const containerStyles = xcss({
  backgroundColor: 'elevation.surface.raised',
  boxShadow: 'elevation.shadow.raised',
  padding: 'space.200',
  borderRadius: 'border.radius',
});

const TrackerPage = ({ resetApiKey }) => {
  const { handleSubmit } = useForm();

  const onResetApiKey = async (data) => {
    resetApiKey();
  };

  let homePage = StartTimer();


  if (true) {
    homePage = ActiveTimer();
  }

  return (
    <>
      <Inline>
        <Box padding='space.100'></Box>
        <Box xcss={containerStyles}>
          <Stack space="space.100">
            <Tabs id="default">
              <TabList>
                <Tab>Timer</Tab>
                <Tab>Manual</Tab>
              </TabList>
              <TabPanel>
                {homePage}
              </TabPanel>
              <TabPanel>
                <Box padding="space.300">
                  This is the content area of the third tab.
                </Box>
              </TabPanel>
            </Tabs>
          </Stack>
        </Box>
        <Box padding='space.100'></Box>
      </Inline>

      <Box padding='space.100'></Box>
      <Inline>
        <Box padding='space.200'></Box>
        <Link href="https://teams.scrumlaunch.com/time-tracker" openNewTab={true}>Manage tracked time</Link>
      </Inline>
      <Form onSubmit={handleSubmit(onResetApiKey)}>
        <Inline>
          <Box padding='space.200'></Box>
          <Button type='submit' appearance="primary" onClick={handleSubmit(onResetApiKey)}>
            Reset API key
          </Button>
        </Inline>
      </Form>
    </>
  );
};

export default TrackerPage; 