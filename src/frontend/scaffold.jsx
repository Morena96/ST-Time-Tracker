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
  const context = useProductContext();
  const [localActiveTimer, setLocalActiveTimer] = useState(null);
  const [issueKey, setIssueKey] = useState(null);
  const [activeTimer, setActiveTimer] = useState(_activeTimer);
  const [isLoading, setIsLoading] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchActiveProject = async () => {
    const activeProject = localStorage.getItem('activeProject');

    if (activeProject) {
      setActiveProject(activeProject);
    }
  };

  useEffect(() => {
    if (context) {
      const _issueKey = context?.extension?.issue?.key;
      setIssueKey(_issueKey);
    }

    const fetchLocalActiveTimer = async () => {
      setIsLoading(true);
      const timeEntryStr = localStorage.getItem('timeEntry');
      if (timeEntryStr) {
        const parsedTimeEntry = JSON.parse(timeEntryStr);
        if (!activeTimer || parsedTimeEntry.id !== activeTimer.id) {
          localStorage.removeItem('timeEntry');
        } else {
          const timeEntry = new TimeEntry(
            parsedTimeEntry.id,
            parsedTimeEntry.project_id,
            parsedTimeEntry.start_date,
            parsedTimeEntry.end_date,
            parsedTimeEntry.date,
            parsedTimeEntry.description,
            parsedTimeEntry.tags,
            parsedTimeEntry.kanban_board_id
          );
          setLocalActiveTimer(timeEntry);
        }
      }
      setIsLoading(false);
    };

   

    fetchLocalActiveTimer();
    fetchActiveProject();
  }, [context]);

  const onResetApiKey = async (data) => {
    resetApiKey();
  };
 
  const onTimerStart = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    const date = new Date();
    let summary = null;
    var result = await invoke('getIssueData', { 'issueKey': issueKey });
    if (result && result.success && result.data && result.data.fields) {
      summary = '[' + issueKey + ']: ' + result.data.fields.summary;
    } else {
      console.log('Error getting issue data:', result);
    }

    var apiKey = localStorage.getItem('apiKey');
    var result = await invoke('createTimeEntry',  { 'apiKey': apiKey ,'timeEntry':new TimeEntry(null, activeProject, formatDateToHHMM(date), null, date, summary, null, issueKey).toJson()});

    if (result.success) {
      var cProject = result.timeEntry.project==null?null:result.timeEntry.project.id;
      const timeEntry = new TimeEntry(result.timeEntry.id, cProject, result.timeEntry.start_date, result.timeEntry.end_date, result.timeEntry.date, result.timeEntry.description, result.timeEntry.tags, issueKey);
      localStorage.setItem('timeEntry', JSON.stringify(timeEntry));
      setLocalActiveTimer(timeEntry);
      setActiveTimer(timeEntry);
      return { success: true, timeEntry: timeEntry };

    }
    else {
      return { success: false, error: result.error };
    }
  };

  const onTimerStop = async () => {
    setSuccessMessage('Time Entry has been created');
    setActiveTimer(null);
    setLocalActiveTimer(null);
    localStorage.removeItem('timeEntry');
  };

  const onDiscarded = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    localStorage.removeItem('timeEntry');
    setLocalActiveTimer(null);
    setActiveTimer(null);
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
            <Tabs id="default" onChange={(index) => {
              // Force rerender of ManualTimer when tab changes to Manual tab (index 1)
              if (index === 1) {
                setActiveTimer(prevState => ({ ...prevState })); // Trigger rerender by updating state
              }
            }}>
              <TabList>
                <Box xcss={newContainer}> <Tab><Inline alignInline='center'> Timer </Inline></Tab></Box>
                <Box xcss={newContainer}> <Tab> <Inline alignInline='center'> Manual </Inline> </Tab></Box>
              </TabList>
              <TabPanel>
                {isTimerActive ? <ActiveTimer issueKey={issueKey} activeTimer={activeTimer} fetchActiveProject={fetchActiveProject} onTimerStop={onTimerStop} onDiscarded={onDiscarded} activeProject={activeProject} /> : <StartTimer onTimerStart={onTimerStart} successMessage={successMessage} errorMessage={errorMessage} />}
              </TabPanel>
              <TabPanel>
                <ManualTimer issueKey={issueKey} activeProject={activeProject} key={`manual-timer-${Date.now()}`} fetchActiveProject={fetchActiveProject} />
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
          <Button type='submit' appearance="warning" spacing='compact' onClick={handleSubmit(onResetApiKey)}>
            Reset API key
          </Button>
        </Inline>
      </Form>
      <Box padding='space.050'></Box>
    </>
  );
};

export default Scaffold; 