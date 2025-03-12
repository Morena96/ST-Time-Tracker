import Resolver from '@forge/resolver';
import { storage, fetch } from '@forge/api';
import { checkResponse } from './utils/checkResponse';
import api, { route } from "@forge/api";
const resolver = new Resolver();
import { baseUrl } from '../frontend/utils/app_constants';
import { getTimezoneOffsetInHours } from '../frontend/utils/timeUtils';

///  ---------------------------- External Api Calls ---------------------------- 


const requestWithLogging = async (url, apiKey, method, payload = {}) => {
  console.log('Request URL:', url);
  console.log('Request Headers:', {
    "HTTP-USER-TOKEN": apiKey,
    'Content-Type': 'application/json; charset=UTF-8',
  });
  console.log('Request Payload:', payload);

  const result = await fetch(url, {
    method: method,
    headers: {
      "HTTP-USER-TOKEN": apiKey,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    ...(method !== 'GET' ? { body: JSON.stringify(payload) } : {})
  });

  var error = null;
  var data = null;

  if (!result.ok) {
    const errorText = await result.text();
    try {
      const errorJson = JSON.parse(errorText);
      error = errorJson.errors;
    } catch {
      error = errorText;
    }
  } else {
    data = await result.json();
  }

  return { success: result.ok, error: error, data: data };
};

resolver.define('getRemoteActiveTimer', async ({ payload }) => {
  console.log('getRemoteActiveTimer called');
  const apiKey = payload.apiKey;
  const time_zone = getTimezoneOffsetInHours();
  const url = `${baseUrl}/user_time_entries?page=1&limit=25&order_by=time&sort_to=desc&time_zone=${time_zone}`;

  const result = await requestWithLogging(url, apiKey, 'GET');

  if (result.success) {
    await storage.set('apiKey', apiKey);
  } else {
    await storage.delete('apiKey');
  }

  return result;
});

resolver.define('createTimeEntry', async ({ payload }) => {
  const apiKey = await storage.get('apiKey');
  const result = await requestWithLogging(`${baseUrl}/user_time_entries`, apiKey, 'POST', payload);
  return result;
});

resolver.define('updateTimeEntry', async ({ payload }) => {
  const apiKey = await storage.get('apiKey');
  const result = await requestWithLogging(`${baseUrl}/user_time_entries/${payload.timeEntryId}`, apiKey, 'PUT', payload);
  return result;
});

resolver.define('deleteActiveTimer', async ({ payload }) => {
  const apiKey = await storage.get('apiKey');
  const result = await requestWithLogging(`${baseUrl}/user_time_entries/${payload.timeEntryId}`, apiKey, 'DELETE');
  return result;
});


///  ---------------------------- Jira Api Calls ---------------------------- 


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


///  ---------------------------- Local Storage ---------------------------- 


resolver.define('storeApiKey', async ({ payload }) => {
  await storage.set('apiKey', payload.apiKey);
  return { success: true };
});

resolver.define('getApiKey', async () => {
  try {
    const apiKey = await storage.get('apiKey');
    return { apiKey };
  } catch (error) {
    throw error;
  }
});


resolver.define('getLocalActiveTimer', async () => {
  const timeEntry = await storage.get('timeEntry');

  return { success: true, timeEntry: timeEntry };
});

resolver.define('setLocalActiveTimer', async ({ payload }) => {
  const result = await storage.set('timeEntry', payload.timeEntry);
  return { success: true };
});

resolver.define('getProjects', async () => {
  const apiKey = await storage.get('apiKey');
  const result = await requestWithLogging(`${baseUrl}/user_time_entries/projects`, apiKey, 'GET');
  return result;
});

resolver.define('deleteLocalActiveTimer', async () => {
  await storage.delete('timeEntry');
  return { success: true };
});

resolver.define('resetApiKey', async () => {
  await storage.delete('apiKey');
  return { success: true };
});

export const handler = resolver.getDefinitions();
