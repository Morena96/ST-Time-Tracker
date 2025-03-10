import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import Tag from './models/tag';
import Project from './models/project';
import ProjectDropdown from './widgets/project_dropdown';
import TagMultiDropdown from './widgets/tag_multi_dropdown';
import Divider from './widgets/divider';
import DescriptionField from './widgets/description_field';
import { Stack, Box, Button, Modal, ModalBody, ModalTransition, ModalTitle, ModalFooter, ModalHeader, Text, Strong } from '@forge/react';
import { formatIntToDuration } from './utils/timeUtils';


const ActiveTimer = ({ activeTimer, onTimerStop }) => {
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const onDiscardTimer = () => setIsOpen(true);
  const [description, setDescription] = useState(activeTimer.description);
  const [selectedProject, setSelectedProject] = useState(activeTimer.project);
  const [selectedTags, setSelectedTags] = useState(activeTimer.tags);
  const [duration, setDuration] = useState(0);
  const tags = Tag.tags;

  useEffect(() => {
    const diffInMs = new Date().getTime() - activeTimer.startDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    setDuration(diffInSeconds);

    const fetchProjects = async () => {
      const result = await invoke('getProjects');
      if (result.success) {
        const projectsList = result.projects.map(project => new Project(project.id, project.name, project.logoS3Key, project.active));
        setProjects(projectsList);
      } else {
        console.error('Error fetching projects ', result.error);
      }
    };
    fetchProjects();
  }, []);



  const handleProjectChange = async (projectId) => {
    const result = await invoke('updateTimeEntry', activeTimer.id, { projectId });
    if (result.success) {
      setSelectedProject(projectId);
    } else {
      console.error('Error updating project ', result.error);
    }
  };

  const handleTagsChange = async (tags) => {
    const result = await invoke('updateTimeEntry', activeTimer.id, { tags });
    if (result.success) {
      setSelectedTags(tags);
    } else {
      console.error('Error updating tags ', result.error);
    }
  };

  const handleDescriptionChange = async (description) => {
    const result = await invoke('updateTimeEntry', activeTimer.id, { description });
    if (result.success) {
      setDescription(description);
    } else {
      console.error('Error updating description ', result.error);
    }
  };

  return (
    <Stack grow='fill'>

      <Box padding='space.100'></Box>

      <DescriptionField description={description} setDescription={handleDescriptionChange} />

      <Box padding='space.200'></Box>
      <Heading as="h2">{formatIntToDuration(duration)}</Heading>
      <Box padding='space.200'></Box>


      <Button type='submit' appearance="danger" shouldFitContainer onClick={onTimerStop}>
        STOP TIMER
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal}>
            <ModalHeader>
              <ModalTitle>Discard Entry</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Text>
                <Strong>Time tracker - Entry</Strong>  will be deleted immediately. You can't undo this action. Are you sure you want to delete?
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle" onClick={closeModal}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={closeModal}>
                Discard
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>


      <Box padding='space.050'></Box>
      <Button type='submit' appearance="primary" shouldFitContainer onClick={onDiscardTimer}>
        DISCARD
      </Button>


      <Divider />

      <ProjectDropdown projects={projects} handleProjectChange={handleProjectChange} selectedProject={selectedProject} />
      <Box padding='space.100'></Box>
      <TagMultiDropdown tags={tags} handleTagsChange={handleTagsChange} selectedTags={selectedTags} />
      <Box padding='space.100'></Box>

    </Stack>
  );
};

export default ActiveTimer;