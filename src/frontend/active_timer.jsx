import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import Tag from './models/tag';
import Project from './models/project';
import ProjectDropdown from './widgets/project_dropdown';
import TagMultiDropdown from './widgets/tag_multi_dropdown';
import Divider from './widgets/divider';
import DescriptionField from './widgets/description_field';
import { Stack, Box, Button, Modal, ModalBody, ModalTransition, ModalTitle, ModalFooter, ModalHeader, Text, Strong, Heading, Inline } from '@forge/react';
import { formatIntToDuration } from './utils/timeUtils';
import ErrorMessage from './widgets/error_message';


const ActiveTimer = ({ activeTimer, onTimerStop, onDiscarded }) => {
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = (isConfirmed) => {
    setIsOpen(false);
    if (isConfirmed) {
      onDiscarded();
    }
  };
  const onDiscardTimer = () => setIsOpen(true);
  const [description, setDescription] = useState(activeTimer.description);
  const [selectedProject, setSelectedProject] = useState(activeTimer.project_id);
  const [selectedTags, setSelectedTags] = useState(activeTimer.tags);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const tags = Tag.tags;

  useEffect(() => {
    console.log('start date', activeTimer.start_date);
    const diffInMs = new Date().getTime() - new Date(activeTimer.start_date).getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    setDuration(diffInSeconds);

    // Add interval to update duration every second
    const intervalId = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    const fetchProjects = async () => {
      const result = await invoke('getProjects');
      if (result.success) {
        const projectsList = result.projects.map(project => new Project(project.id, project.name, project.logoS3Key, project.active));
        projectsList.sort((a, b) => a.name.localeCompare(b.name));
        setProjects(projectsList);
      } else {
        console.error('Error fetching projects ', result.error);
      }
    };
    fetchProjects();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);



  const handleProjectChange = async (projectId) => {
    const result = await invoke('updateTimeEntry', { 'timeEntryId': activeTimer.id, 'project_id': projectId });
    if (result.success) {
      setSelectedProject(projectId);
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleTagsChange = async (tags) => {
    const result = await invoke('updateTimeEntry', { 'timeEntryId': activeTimer.id, 'tags': tags });
    if (result.success) {
      setSelectedTags(tags);
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleDescriptionChange = async (description) => {
    const result = await invoke('updateTimeEntry', { 'timeEntryId': activeTimer.id, 'description': description });
    if (result.success) {
      setDescription(description);
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <Stack grow='fill'>

      <Box padding='space.100'></Box>

      <DescriptionField description={description} setDescription={handleDescriptionChange} />

      <Box padding='space.200'></Box>
      <Inline alignInline='center'>
        <Heading as="h2">{formatIntToDuration(duration)}</Heading>
      </Inline>
      <Box padding='space.200'></Box>


      <Button type='submit' appearance="danger" shouldFitContainer onClick={onTimerStop}>
        STOP TIMER
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={() => closeModal(false)}>
            <ModalHeader>
              <ModalTitle>Discard Entry</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Text>
                <Strong>Time tracker - Entry</Strong>  will be deleted immediately. You can't undo this action. Are you sure you want to delete?
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle" onClick={() => closeModal(false)}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={() => closeModal(true)}>
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

      {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />}

      <Box padding='space.100'></Box>

      <ProjectDropdown projects={projects} handleProjectChange={handleProjectChange} selectedProjectId={selectedProject} />
      <Box padding='space.100'></Box>
      <TagMultiDropdown tags={tags} handleTagsChange={handleTagsChange} selectedTags={selectedTags} />
      <Box padding='space.100'></Box>

    </Stack>
  );
};

export default ActiveTimer;