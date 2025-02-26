import React, { useState, useEffect } from 'react';
import { Box, Inline, Button, Link, Form, useForm, xcss, Stack, Tabs, TabList, Tab, TabPanel } from '@forge/react';
import StartTimer from './start_timer';
import { invoke } from '@forge/bridge';
import Tag from '../models/tag';
import Project from '../models/project';
import ManualTimer from './manual_timer';

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

  const [projects, setProjects] = useState([]);
  const tags = Tag.tags;

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await invoke('getProjects');
      if (result.success) {
        const projectsList = result.projects.projects.map(project => new Project(project.id, project.name, project.logoS3Key, project.active));
        setProjects(projectsList);
      } else {
        console.error('Error fetching projects ', result.error);
      }
    };
    fetchProjects();
  }, []);


  const handleProjectChange = (projectId) => {
    console.log('projectId', projectId);
  };

  const onResetApiKey = async (data) => {
    resetApiKey();
  };

  let homePage = StartTimer();


  // if (true) {
  //   homePage = ActiveTimer();
  // }

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
                <ManualTimer projects={projects} handleProjectChange={handleProjectChange} />
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