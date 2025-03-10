import { Box, Inline, Button, Link, Form, useForm, xcss, Stack, Tabs, TabList, Tab, TabPanel, useProductContext } from '@forge/react';
import StartTimer from './start_timer';
import ManualTimer from './manual_timer';
import ActiveTimer from './active_timer';
import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import { siteUrl } from './utils/app_constants';
import TimeEntry from './models/time_entry';
import { formatDateToHHMM } from './utils/timeUtils';
import Loader from './widgets/loader';

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


const Scaffold = ({ resetApiKey, _activeTimer }) => {
  const { handleSubmit } = useForm();
  const [summary, setSummary] = useState('');
  const context = useProductContext();
  const [localActiveTimer, setLocalActiveTimer] = useState(null);
  const [issueKey, setIssueKey] = useState(null);
  const [activeTimer, setActiveTimer] = useState(_activeTimer);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (context) {
      const fetchIssueData = async () => {
        const _issueKey = context?.extension?.issue?.key;
        setIssueKey(_issueKey);
        const result = await invoke('getIssueData', { 'issueKey': _issueKey });
        if (result.success) {
          setSummary('[' + _issueKey + ']: ' + result.data.fields.summary);
        } else {
          console.log('result', result);
        }
      };

      fetchIssueData();
    }

    const fetchLocalActiveTimer = async () => {
      setIsLoading(true);
      const result = await invoke('getLocalActiveTimer');
      if (result.timeEntry) {
        if (!activeTimer || result.timeEntry.id !== activeTimer.id) {
          await invoke('deleteLocalActiveTimer');
        } else {
          setLocalActiveTimer(result.timeEntry);
        }
      }
      setIsLoading(false);
    };

    fetchLocalActiveTimer();
  }, [context]);

  const onResetApiKey = async (data) => {
    resetApiKey();
  };

  const onTimerStart = async () => {
    const date = new Date();
    console.log('onTimerStart', date);
    const result = await invoke('createTimeEntry', new TimeEntry(null, null, formatDateToHHMM(date), null, date, summary, null, issueKey).toJson());


    if (result.success) {
      console.log('timeEntry', result.timeEntry);
      const timeEntry = new TimeEntry(result.timeEntry.id, result.timeEntry.project_id, result.timeEntry.start_date, result.timeEntry.end_date, result.timeEntry.date, result.timeEntry.description, result.timeEntry.tags, issueKey);
      await invoke('setLocalActiveTimer', { 'timeEntry': timeEntry });
      setLocalActiveTimer(timeEntry);
      setActiveTimer(timeEntry);
      return { success: true, timeEntry: timeEntry };

    }
    else {
      return { success: false, error: result.error };
    }
  };

  const onTimerStop = async () => {
    const result = await invoke('stopTimeEntry', activeTimer.id);
    if (result.success) {
      setActiveTimer(null);
    } else {
      console.error('Error stopping timer ', result.error);
    }
  };
  
  var isTimerActive = localActiveTimer && activeTimer && localActiveTimer.id === activeTimer.id && localActiveTimer.kanban_board_id === issueKey

  const url = siteUrl + '/time-tracker';

  if (isLoading) {
    return <Loader />;
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
                {isTimerActive ? <ActiveTimer activeTimer={activeTimer} onTimerStop={onTimerStop} /> : <StartTimer onTimerStart={onTimerStart} />}
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
        <Link href={url} openNewTab={true}>Manage tracked time</Link>
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