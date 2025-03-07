import Resolver from '@forge/resolver';
import { storage, fetch } from '@forge/api';
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

resolver.define('getRemoteActiveTimer', async ({ payload }) => {
  const apiKey = payload.apiKey;
  const time_zone = getTimezoneOffsetInHours();
  const url = `${baseUrl}/user_time_entries?page=1&limit=25&order_by=time&sort_to=desc&time_zone=${time_zone}`;

  const result = await fetch(url, {
    method: 'GET',
    headers: {
      "HTTP-USER-TOKEN": apiKey,
      'Content-Type': 'application/json; charset=UTF-8',
    }
  });

  if (result.ok) {
    await storage.set('apiKey', apiKey);
  } else {
    await storage.delete('apiKey');
  }

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

  if (result.ok) {
    const activeTimer = await result.json();
    return { success: result.ok, activeTimer: activeTimer };
  } else {
    return { success: result.ok, error: error };
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

resolver.define('deleteLocalActiveTimer', async () => {
  await storage.delete('timeEntry');
  return { success: true };
});

// resolver.define('checkApiKey', async ({ payload }) => {
//   try {
//     const result = await fetch(`${baseUrl}/users/info`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${payload.apiKey}`,
//         'Content-Type': 'application/json; charset=UTF-8',
//       }
//     });

//     await checkResponse('checkApiKey', result);

//     const user = await result.json();

//     if (result.ok) {
//       await storage.set('apiKey', payload.apiKey);
//     } else {
//       await storage.delete('apiKey');
//     }

//     return { success: result.ok ,user};

//   } catch (error) {
//     await storage.delete('apiKey');
//     return { success: false };
//   }
// });

resolver.define('getProjects', async () => {
  const apiKey = await storage.get('apiKey');
  const result = await fetch(`${baseUrl}/user_time_entries/projects`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json; charset=UTF-8',
    }
  });

  await checkResponse('getProjects', result);

  const projectsDict = await result.json();

  return { success: true, projects: projectsDict.projects };
});

resolver.define('stopActiveTimer', async () => {
  const startTime = await storage.get('timerStart');
  const endTime = Date.now();
  const duration = endTime - startTime;
  await storage.delete('timerStart');
  return { duration };
});

resolver.define('createTimeEntry', async ({ payload }) => {
  console.log('payload', payload);

  const apiKey = await storage.get('apiKey');

  const result = await fetch(`${baseUrl}/user_time_entries`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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

  return { success: result.ok, error: error, timeEntry:await result.json() };
});

resolver.define('getActiveTimer', async () => {
  const timerStart = await storage.get('timerStart');
  return { isRunning: !!timerStart, startTime: timerStart };
});



resolver.define('changeTimerDescription', async ({ payload }) => {
  await storage.set('timerDescription', payload.description);
  return { success: true };
});

resolver.define('changeTimerTag', async ({ payload }) => {
  await storage.set('timerTag', payload.tag);
  return { success: true };
});

resolver.define('changeTimerProject', async ({ payload }) => {
  await storage.set('timerProject', payload.project);
  return { success: true };
});

resolver.define('deleteActiveTimer', async () => {
  await storage.delete('timerStart');
  await storage.delete('timerDescription');
  await storage.delete('timerTag');
  await storage.delete('timerProject');
  return { success: true };
});



resolver.define('resetApiKey', async () => {
  await storage.delete('apiKey');
  return { success: true };
});

export const handler = resolver.getDefinitions();
