import { Select, Stack, Label, RequiredAsterisk, Heading, Box } from '@forge/react';
import React from 'react';

const ProjectDropdown = ({ projects, handleProjectChange, selectedProjectId }) => {
    const onChange = (e) => {
        handleProjectChange(e.value);
    }

    console.log('selectedProjectId', selectedProjectId);

    var selectedProject = null;

    if (selectedProjectId) {
        selectedProject = projects.find(p => p.id === selectedProjectId);
    }

    return (
        <Stack grow='fill'>
            <Label labelFor="select"><Heading as="h5">Project: <RequiredAsterisk /></Heading></Label>
            <Box padding='space.025'></Box>
            <Select
                appearance="default"
                options={projects.map(project => ({ label: project.name, value: project.id }))}
                onChange={onChange}
                placeholder="Select a project"
                value={selectedProject ? { label: selectedProject.name, value: selectedProject.id } : null}
            />
        </Stack>
    );
};

export default ProjectDropdown;