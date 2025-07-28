import ProjectDropdown from './widgets/project_dropdown';
import TagMultiDropdown from './widgets/tag_multi_dropdown';
import { Stack, Box, Button, Textfield, Inline, DatePicker, Text, xcss, useForm, Form, LoadingButton } from '@forge/react';
import React, { useState, useEffect,useRef } from 'react';
import Divider from './widgets/divider';
import { invoke } from '@forge/bridge';
import Tag from './models/tag';
import Project from './models/project';
import DescriptionField from './widgets/description_field';
import TimeEntry from './models/time_entry';
import { parseTime, parseDate, formatDate, getLastUnlockedDate, parseStringToDuration, formatDateToHHMM, formatIntToDuration, getYesterday } from './utils/timeUtils';
import ErrorMessage from './widgets/error_message';
import SuccessMessage from './widgets/success_message';
import Loader from './widgets/loader';
import { formatDateToISO } from './utils/timeUtils';
const ManualTimer = ({ issueKey, activeProject, fetchActiveProject }) => {
  const [projects, setProjects] = useState([]);
  const tags = Tag.tags;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [date, setDate] = useState(null);
  const [duration, setDuration] = useState("00:00:00");
  const [oldStartDate, setOldStartDate] = useState(null);
  const [oldEndDate, setOldEndDate] = useState(null);
  const [oldDuration, setOldDuration] = useState(null);
  const [projectId, setProjectId] = useState(activeProject);
  const [selectedTags, setSelectedTags] = useState([]);
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { handleSubmit, formState } = useForm();
  const [isStartDateUpdated, setIsStartDateUpdated] = useState(false);
  const [isEndDateUpdated, setIsEndDateUpdated] = useState(false);
  const [isDurationUpdated, setIsDurationUpdated] = useState(false);


  useEffect(() => {
    setStartDate(formatDateToHHMM(new Date()));
    setEndDate(formatDateToHHMM(new Date()));
    setDate(new Date());

    const fetchData = async () => {
      const promises = [];
      
      // Add fetchProjects promise
      var apiKey = localStorage.getItem('apiKey');
      const fetchProjectsPromise = invoke('getProjects', { 'apiKey': apiKey }).then(result => {
        if (result.success) {
          const projectsList = result.projects.map(project => new Project(project.id, project.name, project.logoS3Key, project.active));
          projectsList.sort((a, b) => a.name.localeCompare(b.name));
          setProjects(projectsList);
        } else {
          console.error('Error fetching projects ', result.error);
        }
      });
      promises.push(fetchProjectsPromise);

      // Add fetchIssueData promise if issueKey exists
      if (issueKey) {
        const fetchIssueDataPromise = invoke('getIssueData', { 'issueKey': issueKey }).then(result => {
          if (result.success) {
            setDescription('[' + issueKey + ']: ' + result.data.fields.summary);
          } else {
            console.log('result', result);
          }
        });
        promises.push(fetchIssueDataPromise);
      }

      // Wait for all promises to complete
      await Promise.all(promises);
      setIsLoading(false);
    };

    fetchData();
  }, [issueKey]);

  const handleProjectChange = (projectId) => {
    setProjectId(projectId);
  };

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const handleDescriptionChange = (description) => {
    setDescription(description);
  };

  const onStartDateFocus = () => {
    setOldStartDate(startDate);
  }

  const onEndDateFocus = () => {
    setOldEndDate(endDate);
  }
  
  const onDurationFocus = () => {
    setOldDuration(duration);
  }

  const changeStartDate = (e) => {
    if (/^[0-9]{0,4}$|^[0-9]{1,2}:[0-9]{0,2}$/.test(e.target.value)) {
      setStartDate(e.target.value);
    }
  }

  const changeEndDate = (e) => {
    if (/^[0-9]{0,4}$|^[0-9]{1,2}:[0-9]{0,2}$/.test(e.target.value)) {
      setEndDate(e.target.value);
    }
  }

  const changeDuration = (e) => {
    if (/^[0-9]{0,5}$|^[0-9]{1,2}:[0-9]{0,2}$|^[0-9]{1,2}:[0-9]{1,2}:[0-9]{0,2}$/.test(e.target.value)) {
      setDuration(e.target.value);
    }
  }

  const handleStartDateChange = (e) => {
    if (oldStartDate !== startDate) {
      setIsStartDateUpdated(true);
    }

    const newStartDate = parseTime(startDate, date);
    var endTime = parseTime(endDate, date);

    if (newStartDate > endTime) {
      endTime = new Date(endTime.setDate(endTime.getDate() + 1));
    }

    if (!(getYesterday(endTime) < newStartDate)) {
      endTime = new Date(endTime.setDate(endTime.getDate() - 1));
    }

    const diffInMs = endTime.getTime() - newStartDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);


    setDuration(formatIntToDuration(diffInSeconds));
    setStartDate(formatDateToHHMM(newStartDate));
    setEndDate(formatDateToHHMM(endTime));
    setIsStartDateUpdated(false);
  };


  const handleEndDateChange = (e) => {
    if (oldEndDate !== endDate) {
      setIsEndDateUpdated(true);
    }

    const startTime = parseTime(startDate, date);
    var newEndDate = parseTime(endDate, date);

    if (startTime > newEndDate) {
      newEndDate = new Date(newEndDate.setDate(newEndDate.getDate() + 1));
    }

    if (!(getYesterday(newEndDate) < startTime)) {
      newEndDate = new Date(newEndDate.setDate(newEndDate.getDate() - 1));
    }

    const diffInMs = newEndDate.getTime() - startTime.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    setDuration(formatIntToDuration(diffInSeconds));
    setEndDate(formatDateToHHMM(newEndDate));
    setIsEndDateUpdated(false);
  }

  const handleDurationChange = (e) => {
    if (oldDuration !== duration) {
      setIsDurationUpdated(true);
    }
    const startTime = parseTime(startDate, date);
    const newDuration = parseStringToDuration(duration);
    setEndDate(formatDateToHHMM(new Date(startTime.setSeconds(startTime.getSeconds() + newDuration))));
    setDuration(formatIntToDuration(newDuration));
    setIsDurationUpdated(false);
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

    const timeEntryJson = new TimeEntry(null, projectId, startDate, endDate, date, description, selectedTags).toJson();

    setIsSaving(true);

    var apiKey = localStorage.getItem('apiKey');
    const result = await invoke('createTimeEntry', { 'apiKey': apiKey, 'timeEntry': timeEntryJson } );

    if (result.success) {
      if (projectId) {
        localStorage.setItem('activeProject', projectId);
      }

      var st = new Date(timeEntryJson.start_date);
      var seconds = Math.floor((timeEntryJson.end_date - st) / 1000);
      var minutes = Math.round(seconds/60);
      var bodyData = JSON.stringify({
        comment: {
          content: [
            {
              content: [
                {
                  text: description,
                  type: "text"
                }
              ],
              type: "paragraph"
            }
          ],
          type: "doc",
          version: 1
        },
        timeSpent: `${minutes}m`,
        started: formatDateToISO(st)
      });

      console.log('bodyData', bodyData);
      await invoke('createIssueWorkLog', { 'bodyData': bodyData, 'issueKey': issueKey });


      fetchActiveProject();
      setStartDate(formatDateToHHMM(timeEntryJson.end_date));
      setDate(timeEntryJson.end_date);

      const timeDiff = new Date(timeEntryJson.end_date) - new Date(timeEntryJson.start_date);
      const newEndDate = new Date(timeEntryJson.end_date).getTime() + timeDiff;
      setEndDate(formatDateToHHMM(new Date(newEndDate)));

      setSuccessMessage("Time entry has been created");
    } else {
      setErrorMessage(result.error);
    }

    setIsSaving(false);
  };

  const datePickerStyle = xcss({
    flexGrow: 1,
    width: '100%',
  })

  const rangeInputStyle = xcss({
    minWidth: '100px',
  })


  if (isLoading) {
    return <Stack grow='fill'>
      <Box padding='space.200'></Box>
      <Loader />
      <Box padding='space.200'></Box>
    </Stack>;
  }

  return (
    <Form onSubmit={handleSubmit(addTimeEntry)}>
      <Stack grow='fill'>
        <Box padding='space.100'></Box>

        <DescriptionField description={description} setDescription={handleDescriptionChange} />
        <Box padding='space.100'></Box>

        <Textfield
          key={`duration-${isStartDateUpdated || isEndDateUpdated || isDurationUpdated}`}
          onFocus={onDurationFocus}
          onChange={changeDuration}
          onBlur={handleDurationChange}
          defaultValue={duration}
        />
        {formState.errors.durationTextfield && (
          <ErrorMessage>Should not be empty</ErrorMessage>
        )}

        <Box padding='space.100'></Box>
        <Inline space='space.050'>
          <Box xcss={datePickerStyle}>
            <DatePicker
              value={formatDate(date)}
              onChange={handleDateChange}
              // dateFormat="YYYY-MM-DD"
              minDate={formatDate(getLastUnlockedDate())}
            />
          </Box>
          <Box xcss={rangeInputStyle}>
            <Inline space='space.050'>
              <Textfield
                key={`startDate-${isStartDateUpdated}`}
                defaultValue={startDate}
                onChange={changeStartDate}
                onFocus={onStartDateFocus}
                onBlur={handleStartDateChange}
              />
              <Text> - </Text>
              <Textfield
                key={`endDate-${isEndDateUpdated || isDurationUpdated}`}
                defaultValue={endDate}
                onChange={changeEndDate}
                onFocus={onEndDateFocus}
                onBlur={handleEndDateChange}
              />
            </Inline>
          </Box>
        </Inline>

        <Box padding='space.100'></Box>

        {isSaving ? (
          <LoadingButton appearance="primary" isLoading shouldFitContainer />
        ) : (
          <Button appearance="primary" type='submit'>
            ADD TIME
          </Button>
        )}


        <Divider />

        {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />}
        {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage(null)} />}

        <Box padding='space.100'></Box>
        <ProjectDropdown projects={projects} handleProjectChange={handleProjectChange} selectedProjectId={projectId} />
        <Box padding='space.100'></Box>
        <TagMultiDropdown tags={tags} handleTagsChange={handleTagsChange} selectedTags={selectedTags} />
        <Box padding='space.100'></Box>
      </Stack>
    </Form>
  );
};

export default ManualTimer;