import { Box, Inline, Button, Link, Form, useForm, xcss, Stack, Tabs, TabList, Tab, TabPanel, useProductContext } from '@forge/react';
import StartTimer from './start_timer';
import ManualTimer from './manual_timer';
import ActiveTimer from './active_timer';
import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import TimeEntry from './models/time_entry';

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


const Scaffold = ({ resetApiKey, user }) => {
  const { handleSubmit } = useForm();
  const [summary, setSummary] = useState('');
  const context = useProductContext();
  const [activeTimer, setActiveTimer] = useState(null);


  useEffect(() => {

    if (context) {
      const fetchIssueData = async () => {
        const issueKey = context?.extension?.issue?.key;

        const result = await invoke('getIssueData', { 'issueKey': issueKey });
        if (result.success) {
          setSummary('[' + issueKey + ']: ' + result.data.fields.summary);
        } else {
          console.log('result', result);
        }
      };

      fetchIssueData();
    }


    const fetchActiveTimer = async () => {
      const result = await invoke('getRemoteActiveTimer', { 'user_id': user.id });
      if (result.success) {
        const activeTimer = result.activeTimer;
        for (const timeEntry of activeTimer.time_entries) {
          if (timeEntry.end_date === null) {
            console.log('timeEntry', timeEntry);
            setActiveTimer(new TimeEntry(timeEntry.id, timeEntry.project_id, timeEntry.start_date, timeEntry.end_date, timeEntry.description, timeEntry.tags));
          }
        }
      }
    };
    fetchActiveTimer();
  }, [context]);

  const onResetApiKey = async (data) => {
    resetApiKey();
  };

  let homePage = StartTimer();


  if (true) {
    homePage = ActiveTimer(summary);
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
                <ManualTimer summary={summary} />
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