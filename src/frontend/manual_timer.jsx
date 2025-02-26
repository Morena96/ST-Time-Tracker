import ProjectDropdown from './project_dropdown';
import { Stack, Box } from '@forge/react';
import React from 'react';
import Divider from './widgets/divider';

const ManualTimer = ({ projects, handleProjectChange }) => {
  return (
    <Stack>
      <Box padding='space.100'></Box>
      
      <Divider />

      <ProjectDropdown projects={projects} handleProjectChange={handleProjectChange} />
    </Stack>
  );
};

export default ManualTimer;