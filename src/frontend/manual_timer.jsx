import ProjectDropdown from './widgets/project_dropdown';
import TagMultiDropdown from './widgets/tag_multi_dropdown';
import { Stack, Box, Button, Textfield, Inline, DatePicker, Text, xcss } from '@forge/react';
import React, { useState, useEffect } from 'react';
import Divider from './widgets/divider';
import { invoke } from '@forge/bridge';
import Tag from './models/tag';
import Project from './models/project';
import DescriptionField from './widgets/description_field';
import TimeEntry from './models/time_entry';
import { parseTime, parseDate, formatDate, getLastUnlockedDate, parseStringToDuration, formatDateToHHMM, timeStringToNumberString, numberToTimeString, formatIntToDuration, getYesterday, durationToNumberString } from './utils/timeUtils';
import Duration from './models/Duration';
import ErrorMessage from './widgets/error_message';
import SuccessMessage from './widgets/success_message';

const ManualTimer = ({ summary }) => {
  const [projects, setProjects] = useState([]);
  const tags = Tag.tags;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [date, setDate] = useState(null);
  const [duration, setDuration] = useState(0);
  const [projectId, setProjectId] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [description, setDescription] = useState('');
  const [isStartDateFocused, setIsStartDateFocused] = useState(false);
  const [isEndDateFocused, setIsEndDateFocused] = useState(false);
  const [isDurationFocused, setIsDurationFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDescription(summary);
    setStartDate(formatDateToHHMM(new Date()));
    setEndDate(formatDateToHHMM(new Date()));
    setDate(new Date());

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
  }, [summary]);

  const handleProjectChange = (projectId) => {
    setProjectId(projectId);
  };

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const handleDescriptionChange = (description) => {
    setDescription(description);
  };

  const onFocusStartDate = (e) => {
    setIsStartDateFocused(true);
    setStartDate(timeStringToNumberString(startDate));
  }

  const onFocusEndDate = (e) => {
    setIsEndDateFocused(true);
    setEndDate(timeStringToNumberString(endDate));
  }
  
  const onFocusDuration = (e) => {
    setIsDurationFocused(true);
    setDuration(durationToNumberString(Duration.fromSeconds(duration).toString()));
  }

  const changeStartDate = (e) => {
    setStartDate(e.target.value);
  }

  const changeEndDate = (e) => {
    setEndDate(e.target.value);
  }

  const changeDuration = (e) => {
    setDuration(e.target.value);
  }

  const handleStartDateChange = (e) => {
    const timeString = numberToTimeString(startDate);
    const newStartDate = parseTime(timeString, date);
    var endTime = parseTime(endDate, date);

    if (newStartDate === null) {
      newStartDate = timeString;
    }


    if (newStartDate > endTime) {
      console.log('newStartDate > endTime', endTime);
      endTime = new Date(endTime.setDate(endTime.getDate() + 1));
    }

    if (!(getYesterday(endTime) < newStartDate)) {
      console.log('endTime.getDate() - 1 < newStartDate.getDate()', endTime);
      endTime = new Date(endTime.setDate(endTime.getDate() - 1));
    }
    console.log('newStartDate', newStartDate);
    console.log('endTime', endTime);

    const diffInMs = endTime.getTime() - newStartDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);


    setDuration(diffInSeconds);
    setIsStartDateFocused(false);
    setStartDate(formatDateToHHMM(newStartDate));
    setEndDate(formatDateToHHMM(endTime));
  };


  const handleEndDateChange = (e) => {
    const timeString = numberToTimeString(endDate);
    var newEndDate = parseTime(timeString, date);
    const startTime = parseTime(startDate, date);

    if (newEndDate === null) {
      newEndDate = timeString;
    }

    if (startTime > newEndDate) {
      newEndDate = new Date(newEndDate.setDate(newEndDate.getDate() + 1));
    }

    if (!(getYesterday(newEndDate) < startTime)) {
      newEndDate = new Date(newEndDate.setDate(newEndDate.getDate() - 1));
    }

    const diffInMs = newEndDate.getTime() - startTime.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    setDuration(diffInSeconds);
    setIsEndDateFocused(false);
    setEndDate(formatDateToHHMM(newEndDate));
  }

  const handleDurationChange = (e) => {
    const startTime = parseTime(startDate, date);
    const newDuration = parseStringToDuration(duration);
    setEndDate(formatDateToHHMM(new Date(startTime.setSeconds(startTime.getSeconds() + newDuration))));
    setDuration(newDuration);
    setIsDurationFocused(false);
  }


  const handleDateChange = (newDate) => {
    if (newDate === ' ' || newDate === null) {
      setDate(new Date());
    } else {
      setDate(parseDate(newDate));
    }
  }

  const addTimeEntry = async () => {
    var errorMsg = '';
    if (!projectId) {
      errorMsg = ' project';
    }

    if(description.length === 0) {
      if(errorMsg.length > 0) {
        errorMsg += ',';
      }
      errorMsg += ' description';
    }

    if(errorMsg.length > 0) {
      setErrorMessage("Can't save, fields missing:" + errorMsg);
      return;
    }

    const timeEntry = new TimeEntry(null, projectId, startDate, endDate, date, description, selectedTags);
    console.log('timeEntry', timeEntry);

    setIsLoading(true);

    const result = await invoke('createTimeEntry', timeEntry.toJson());
    console.log('result', result);

    if (result.success) {
      setSuccessMessage("Time entry has been created");
    } else {
      setErrorMessage(result.error);
    }

    setIsLoading(false);
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
      <Textfield
        maxLength={6}
        onChange={changeDuration}
        onFocus={onFocusDuration}
        onBlur={handleDurationChange}
        value={isDurationFocused?duration: formatIntToDuration(duration)}
        type={isDurationFocused ? 'number' : 'text'}
      />

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
              maxLength={4}
              value={startDate}
              onFocus={onFocusStartDate}
              onChange={changeStartDate}
              onBlur={handleStartDateChange}
              type={isStartDateFocused ? 'number' : 'text'}
            />
            <Text> - </Text>
            <Textfield
              maxLength={4}
              value={endDate}
              onFocus={onFocusEndDate}
              onChange={changeEndDate}
              onBlur={handleEndDateChange}
              type={isEndDateFocused ? 'number' : 'text'}
            />
          </Inline>
        </Box>
      </Inline>

      <Box padding='space.100'></Box>
      <Button appearance="primary" onClick={addTimeEntry}>
        ADD TIME
      </Button>

      <Divider />

      {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />}
      {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage(null)} />}

      <Box padding='space.100'></Box>
      <ProjectDropdown projects={projects} handleProjectChange={handleProjectChange} />
      <Box padding='space.100'></Box>
      <TagMultiDropdown tags={tags} handleTagsChange={handleTagsChange} />
      <Box padding='space.100'></Box>
    </Stack>
  );
};

export default ManualTimer;