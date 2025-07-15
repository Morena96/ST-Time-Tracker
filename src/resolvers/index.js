import Resolver from '@forge/resolver';
import { checkResponse } from './utils/checkResponse';
import api, { route } from "@forge/api";
const resolver = new Resolver();
import { baseUrl } from '../frontend/utils/app_constants';
import { getTimezoneOffsetInHours } from '../frontend/utils/timeUtils';

resolver.define('getIssueData', async ({ payload }) => {
  const issueKey = payload.issueKey;
  try {
    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    return { success: true, data: await response.json() };
  } catch (error) {
    console.log('Error fetching issue data:', error);
    return { success: false, error: 'Error fetching issue data 3' };
  }
});

resolver.define('getRemoteActiveTimer', async ({ payload }) => {
  const apiKey = payload.apiKey;

  const time_zone = getTimezoneOffsetInHours();
  const url = `${baseUrl}/user_time_entries?page=1&limit=25&order_by=time&sort_to=desc&time_zone=${time_zone}`;

  try {
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        "HTTP-USER-TOKEN": apiKey,
        'Content-Type': 'application/json; charset=UTF-8',
      }
    });

    var error = null;

    if (!result.ok) {
      const errorText = await result.text();
      try {
        const errorJson = JSON.parse(errorText);
        error = errorJson.errors;
      } catch {
        error = errorText;
      }
    }
    console.log('result', result);
    if (result.ok) {
      const activeTimer = await result.json();
      return { success: result.ok, activeTimer: activeTimer };
    } else {
      return { success: result.ok, error: error, statusCode: result.status };
    }
  } catch (fetchError) {
    // Handle network errors or other fetch failures
    console.log('Network error:', fetchError);
    return { 
      success: false, 
      error: fetchError.message || 'Network error occurred', 
      statusCode: null 
    };
  }
});

resolver.define('getProjects', async ({ payload }) => {
  const apiKey = payload.apiKey;
  const result = await fetch(`${baseUrl}/user_time_entries/projects`, {
    method: 'GET',
    headers: {
      'HTTP-USER-TOKEN': apiKey,
      'Content-Type': 'application/json; charset=UTF-8',
    }
  });

  await checkResponse('getProjects', result);

  const projectsDict = await result.json();

  return { success: true, projects: projectsDict.projects };
});


resolver.define('createTimeEntry', async ({ payload }) => {
  const apiKey = payload.apiKey;

  const result = await fetch(`${baseUrl}/user_time_entries`, {
    method: 'POST',
    headers: {
      'HTTP-USER-TOKEN': apiKey,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload.timeEntry)
  });
  var error = null;

  if (!result.ok) {
    const errorText = await result.text();
    try {
      const errorJson = JSON.parse(errorText);
      error = errorJson.errors;
    } catch {
      error = errorText;
    }
  }
  var data = null;
  
  if (result.ok) {
    data = await result.json();
  }

  return { success: result.ok, error: error, timeEntry: data };
});

resolver.define('updateTimeEntry', async ({ payload }) => {
  const apiKey = payload.apiKey;
  const result = await fetch(`${baseUrl}/user_time_entries/${payload.timeEntryId}`, {
    method: 'PUT',
    headers: {
      'HTTP-USER-TOKEN': apiKey,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload)
  });

  var error = null;

  if (!result.ok) {
    const errorText = await result.text();
    try {
      const errorJson = JSON.parse(errorText);
      error = errorJson.errors;
    } catch {
      error = errorText;
    }
  }
  
  return { success: result.ok, error: error };
});


resolver.define('createIssueWorkLog', async ({ payload }) => {
  const response = await api.asUser().requestJira(route`/rest/api/3/issue/${payload.issueKey}/worklog`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: payload.bodyData
  });
});

resolver.define('deleteActiveTimer', async ({ payload }) => {
  const apiKey = payload.apiKey;
  const result = await fetch(`${baseUrl}/user_time_entries/${payload.timeEntryId}`, {
    method: 'DELETE',
    headers: {
      'HTTP-USER-TOKEN': apiKey,
      'Content-Type': 'application/json; charset=UTF-8',
    }
  });

  var error = null;

  if (!result.ok) {
    const errorText = await result.text();
    try {
      const errorJson = JSON.parse(errorText);
      error = errorJson.errors;
    } catch {
      error = errorText;
    }
  }

  return { success: result.ok, error: error };
});

export const handler = resolver.getDefinitions();
