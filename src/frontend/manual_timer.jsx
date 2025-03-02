import ProjectDropdown from './widgets/project_dropdown';
import TagMultiDropdown from './widgets/tag_multi_dropdown';
import { Stack, Box } from '@forge/react';
import React, { useState, useEffect } from 'react';
import Divider from './widgets/divider';
import { invoke } from '@forge/bridge';
import Tag from '../models/tag';
import Project from '../models/project';
import DescriptionField from './widgets/description_field';


const ManualTimer = ({ summary }) => {
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

  const handleTagsChange = (tags) => {
    console.log('tags', tags);
  };

  const setDescription = (description) => {
    console.log('description', description);
  };

  return (
    <Stack grow='fill'>
      <Box padding='space.100'></Box>

      <DescriptionField description={summary} setDescription={setDescription} />
      <Box padding='space.100'></Box>

      <Divider />

      <ProjectDropdown projects={projects} handleProjectChange={handleProjectChange} />
      <Box padding='space.100'></Box>
      <TagMultiDropdown tags={tags} handleTagsChange={handleTagsChange} />
      <Box padding='space.100'></Box>

    </Stack>
  );
};

export default ManualTimer;