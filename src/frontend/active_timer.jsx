import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import Tag from './models/tag';
import Project from './models/project';
import ProjectDropdown from './widgets/project_dropdown';
import TagMultiDropdown from './widgets/tag_multi_dropdown';
import Divider from './widgets/divider';
import DescriptionField from './widgets/description_field';
import { Stack, Box, Button, useForm, Modal, ModalBody, ModalTransition, ModalTitle, ModalFooter, ModalHeader, Text, Strong } from '@forge/react';

const ActiveTimer = (summary ) => {
  const { handleSubmit } = useForm();

  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const onDiscardTimer = () => setIsOpen(true);

  const tags = Tag.tags;

  useEffect(() => {
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



  const handleProjectChange = (projectId) => {
    console.log('projectId', projectId);
  };

  const handleTagsChange = (tags) => {
    console.log('tags', tags);
  };

  const setDescription = (description) => {
    console.log('description', description);
  };

  const onStopTimer = () => {
    console.log('stop timer');
  };

  return (
    <Stack grow='fill'>

      <Box padding='space.100'></Box>

      <DescriptionField description={summary} setDescription={setDescription} />

      <Box padding='space.100'></Box>

      <Button type='submit' appearance="danger" shouldFitContainer onClick={handleSubmit(onStopTimer)}>
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

      <ProjectDropdown projects={projects} handleProjectChange={handleProjectChange} />
      <Box padding='space.100'></Box>
      <TagMultiDropdown tags={tags} handleTagsChange={handleTagsChange} />
      <Box padding='space.100'></Box>

    </Stack>
  );
};

export default ActiveTimer;