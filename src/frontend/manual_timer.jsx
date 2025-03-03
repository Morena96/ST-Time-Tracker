import ProjectDropdown from './widgets/project_dropdown';
import TagMultiDropdown from './widgets/tag_multi_dropdown';
import { Stack, Box, Button, Textfield, Inline, DatePicker, Text, xcss} from '@forge/react';
import React, { useState, useEffect } from 'react';
import Divider from './widgets/divider';
import { invoke } from '@forge/bridge';
import Tag from './models/tag';
import Project from './models/project';
import Duration from './models/Duration';
import DescriptionField from './widgets/description_field';
import TimeEntry from './models/time_entry';
import { formatDuration, parseTime, parseDate, formatDate, getLastUnlockedDate ,formatTime, formatDateToHHMM} from './utils/timeUtils';

const ManualTimer = ({ summary }) => {
  const [projects, setProjects] = useState([]);
  const tags = Tag.tags;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState(0);
  const [projectId, setProjectId] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [description, setDescription] = useState('');

  console.log('date', date);

  useEffect(() => {
    // const fetchProjects = async () => {
    //   const result = await invoke('getProjects');
    //   if (result.success) {
    //     const projectsList = result.projects.map(project => new Project(project.id, project.name, project.logoS3Key, project.active));
    //     setProjects(projectsList);
    //   } else {
    //     console.error('Error fetching projects ', result.error);
    //   }
    // };
    // fetchProjects();
  }, []);

  const handleProjectChange = (projectId) => {
    setProjectId(projectId);
  };

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const handleDescriptionChange = (description) => {
    setDescription(description);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = parseTime(e.target.value, date);
    if(!newStartDate){
      newStartDate = startDate;
    }

    setStartDate(newStartDate);
    calculateDuration();

  };

  const handleEndDateChange = (e) => {
    const newEndDate = parseTime(e.target.value, date);
    if(!newEndDate){
      newEndDate = endDate;
    }

    setEndDate(newEndDate);
    calculateDuration();
  }

  console.log('startDate', formatDateToHHMM(startDate));
  console.log('endDate', formatDateToHHMM(endDate));

  const handleDateChange = (newDate) => {
    console.log('newDate', newDate);
    console.log('newDate type:', typeof newDate);
    console.log(newDate.length);
    if(newDate===' ' || newDate===null){
      setDate(new Date());
    }else{
      setDate(parseDate(newDate));
    }
  }

  const calculateDuration = () => {
    if (startDate && endDate) {
      const startDuration = parseTime(startDate, date);
      const endDuration = parseTime(endDate, date);
      if (startDuration && endDuration) {
        const diff = endDuration.inSeconds - startDuration.inSeconds;
        setDuration(diff);
      }
    }
  }

  const addTimeEntry = () => {
    const timeEntry = new TimeEntry(projectId, selectedTags, description, startDate, endDate);
    console.log('timeEntry', timeEntry);
  };

  const datePickerStyle = xcss({
    flexGrow: 1,
    width: '100%',
  })

  const rangeInputStyle = xcss({
    minWidth: '100px',
  })

  return (
    <Stack grow='fill'>
      <Box padding='space.100'></Box>

      <DescriptionField description={summary} setDescription={handleDescriptionChange} />
      <Box padding='space.100'></Box>
      <Inline space='space.050'>
        <Box xcss={datePickerStyle}>
          <DatePicker 
            defaultValue={formatDate(date)}
            onChange={handleDateChange}
            // dateFormat="YYYY-MM-DD"
            minDate={formatDate(getLastUnlockedDate())}
          />
        </Box>
        <Box xcss={rangeInputStyle}>
          <Inline space='space.050'>
            <Textfield 
              maxLength={5} 
              value={formatDateToHHMM(startDate)}
              onChange={handleStartDateChange} 
            />
            <Text> - </Text>
            <Textfield 
              maxLength={5} 
              value={formatDateToHHMM(endDate)} 
              onChange={handleEndDateChange} 
            />
          </Inline>
        </Box>
      </Inline>

      {duration !== 0 && (
        <Box padding='space.100'>
          <Text>Duration: {formatDuration(Duration.fromSeconds(duration))}</Text>
        </Box>
      )}

      <Box padding='space.100'></Box>
      <Button appearance="primary" onClick={addTimeEntry}>
        ADD TIME
      </Button>

      <Divider />

      <ProjectDropdown projects={projects} handleProjectChange={handleProjectChange} />
      <Box padding='space.100'></Box>
      <TagMultiDropdown tags={tags} handleTagsChange={handleTagsChange} />
      <Box padding='space.100'></Box>
    </Stack>
  );
};

export default ManualTimer;