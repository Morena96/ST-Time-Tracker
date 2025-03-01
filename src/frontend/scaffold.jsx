import { Box, Inline, Button, Link, Form, useForm, xcss, Stack, Tabs, TabList, Tab, TabPanel,useProductContext } from '@forge/react';
import StartTimer from './start_timer';
import ManualTimer from './manual_timer';
import ActiveTimer from './active_timer';
import React, { useEffect, useState } from 'react';
import api, { route } from "@forge/api";

const containerStyles = xcss({
  backgroundColor: 'elevation.surface.raised',
  boxShadow: 'elevation.shadow.raised',
  padding: 'space.200',
  borderRadius: 'border.radius',
  width: '100%',
});

const newContainer = xcss({
  width: '100%',

});


const Scaffold = ({ resetApiKey }) => {
  const { handleSubmit } = useForm();
  const [data, setData] = useState(null);
  const context = useProductContext();
  const issueKey = 'KAN-1';

  useEffect(() => {


    console.log('issueKey', issueKey);

      const fetchIssueData = async () => {
        if (issueKey) {
        const response = await api.asUser().requestJira(route`/rest/api/3/issue/{issueKey}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
      
        setData(response.json());
      }
      };

      fetchIssueData();
  
  }, []);

  console.log('data', data);

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
                <Box xcss={newContainer}> <Tab><Inline alignInline='center'> Timer </Inline></Tab></Box>
                <Box xcss={newContainer}> <Tab> <Inline alignInline='center'> Manual </Inline> </Tab></Box>
              </TabList>
              <TabPanel>
                {homePage}
              </TabPanel>
              <TabPanel>
                <ManualTimer/>
              </TabPanel>
            </Tabs>
          </Stack>
        </Box>
        <Box padding='space.100'></Box>
      </Inline>

      <Box padding='space.150'></Box>
      <Inline>
        <Box padding='space.100'></Box>
        <Link href="https://teams.scrumlaunch.com/time-tracker" openNewTab={true}>Manage tracked time</Link>
      </Inline>
      <Form onSubmit={handleSubmit(onResetApiKey)}>
        <Inline>
          <Box padding='space.100'></Box>
          <Button type='submit' appearance="primary" onClick={handleSubmit(onResetApiKey)}>
            Reset API key
          </Button>
        </Inline>
      </Form>
      <Box padding='space.050'></Box>
    </>
  );
};

export default Scaffold; 