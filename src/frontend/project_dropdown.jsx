import { Select, Stack, Label, RequiredAsterisk } from '@forge/react';
import React from 'react';

const ProjectDropdown = ({ projects, handleProjectChange, selectedProject }) => {
    return (
        <Stack grow='fill'>
            <Label labelFor="select">Project: <RequiredAsterisk /></Label>
            <Select
                appearance="default"
                options={projects.map(project => ({ label: project.name, value: project.id }))}
                onChange={handleProjectChange}
                placeholder="Select a project"
                value={selectedProject}
            />
        </Stack>
    );
};

export default ProjectDropdown;