import { Select, Stack, Label, Heading, Box } from '@forge/react';
import React from 'react';

const TagMultiDropdown = ({ tags, handleTagsChange, selectedTags }) => {
    return (
        <Stack grow='fill' alignInline='stretch'>
            <Label labelFor="select"><Heading as="h5">Tags: </Heading></Label>
            <Box padding='space.025'></Box>
            <Select
                appearance="default"
                options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
                onChange={handleTagsChange}
                placeholder="Select tags"
                value={selectedTags}
                isMulti
            />
        </Stack>
    );
};

export default TagMultiDropdown;