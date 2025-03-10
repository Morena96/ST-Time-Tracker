import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import Tag from './models/tag';
import Project from './models/project';
import ProjectDropdown from './widgets/project_dropdown';
import TagMultiDropdown from './widgets/tag_multi_dropdown';
import Divider from './widgets/divider';
import DescriptionField from './widgets/description_field';
import { Stack, Box, Button, Modal, ModalBody, ModalTransition, ModalTitle, ModalFooter, ModalHeader, Text, Strong, LoadingButton } from '@forge/react';
import ErrorMessage from './widgets/error_message';
import ActiveDuration from './widgets/active_duration';

const ActiveTimer = ({ activeTimer, onTimerStop, onDiscarded }) => {
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState(activeTimer.description);
  const [selectedProject, setSelectedProject] = useState(activeTimer.project_id);
  const [selectedTags, setSelectedTags] = useState(activeTimer.tags);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const tags = Tag.tags;

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const result = await invoke('getProjects');
      if (result.success) {
        const projectsList = result.projects.map(project => new Project(project.id, project.name, project.logoS3Key, project.active));
        projectsList.sort((a, b) => a.name.localeCompare(b.name));
        setProjects(projectsList);
      } else {
        console.error('Error fetching projects ', result.error);
      }
      setIsLoading(false);
    };
    fetchProjects();
  }, []);



  const handleProjectChange = async (projectId) => {
    setIsLoading(true);
    const result = await invoke('updateTimeEntry', { 'timeEntryId': activeTimer.id, 'project_id': projectId });
    if (result.success) {
      setSelectedProject(projectId);
    } else {
      setErrorMessage(result.error);
    }
    setIsLoading(false);
  };

  const handleTagsChange = async (tags) => {
    setIsLoading(true);
    const result = await invoke('updateTimeEntry', { 'timeEntryId': activeTimer.id, 'tags': tags });
    if (result.success) {
      setSelectedTags(tags);
    } else {
      setErrorMessage(result.error);
    }
    setIsLoading(false);
  };

  const handleDescriptionChange = async (description) => {
    setDescription(description);
  };

  const onBlurDescription = async () => {
    setIsLoading(true);
    const result = await invoke('updateTimeEntry', { 'timeEntryId': activeTimer.id, 'description': description });

    if (!result.success) {
      setErrorMessage(result.error);
    }
    setIsLoading(false);
  }

  const handleStopTimer = async () => {

    var errorMsg = '';
    if (!selectedProject) {
      errorMsg = ' project';
    }

    if (description.length === 0) {
      if (errorMsg.length > 0) {
        errorMsg += ',';
      }
      errorMsg += ' description';
    }

    if (errorMsg.length > 0) {
      setErrorMessage("Can't save, fields missing:" + errorMsg);
      return;
    }
    setIsLoading(true);
    const result = await invoke('updateTimeEntry', { 'timeEntryId': activeTimer.id, 'end_date': new Date() });
    if (result.success) {
      onTimerStop();
    } else {
      setErrorMessage(result.error);
    }
    setIsLoading(false);
  }

  const handleDiscardTimer = async () => {
    setIsLoading(true);
    const result = await invoke('deleteActiveTimer', { 'timeEntryId': activeTimer.id });
    if (result.success) {
      onDiscarded();
    } else {
      setErrorMessage(result.error);
    }
    setIsLoading(false);
  }

  const onDiscardTimer = () => setIsOpen(true);
  const closeModal = (isConfirmed) => {
    setIsOpen(false);
    if (isConfirmed) {
      handleDiscardTimer();
    }
  };


  return (
    <Stack grow='fill'>

      <Box padding='space.100'></Box>

      <DescriptionField description={description} setDescription={handleDescriptionChange} onBlur={onBlurDescription} />

      <ActiveDuration start_date={activeTimer.start_date} />

      {isLoading ? (
        <LoadingButton appearance="danger" isLoading shouldFitContainer />
      ) : (
        <Button type='submit' appearance="danger" shouldFitContainer onClick={handleStopTimer}>
          STOP TIMER
        </Button>
      )}

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