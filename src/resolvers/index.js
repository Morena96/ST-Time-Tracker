import Resolver from '@forge/resolver';
import { storage, fetch } from '@forge/api';
import { checkResponse } from './utils/checkResponse';
import api, { route } from "@forge/api";
const resolver = new Resolver();

// const baseUrl = 'https://scrumteams.herokuapp.com/v2';
const baseUrl = 'https://scrumlaunch-teams-dev.herokuapp.com/v2';

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

resolver.define('getApiKey', async ({ payload }) => {
  try {
    const apiKey = await storage.get('apiKey');
    return { apiKey };
  } catch (error) {
    throw error;
  }
});

resolver.define('checkApiKey', async ({ payload }) => {
  try {
    const result = await fetch(`${baseUrl}/internal/users/info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${payload.apiKey}`,
        'Content-Type': 'application/json; charset=UTF-8',
      }
    });
    
    await checkResponse('checkApiKey', result);

    const user = await result.json();

    if (result.ok) {
      await storage.set('apiKey', payload.apiKey);
    } else {
      await storage.delete('apiKey');
    }

    return { success: result.ok ,user};

  } catch (error) {
    await storage.delete('apiKey');
    return { success: false };
  }
});

resolver.define('getProjects', async () => {
  const apiKey = await storage.get('apiKey');
  const result = await fetch(`${baseUrl}/internal/time_entries/projects_for_search`, {
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

resolver.define('startTimer', async (req) => {
  const timestamp = Date.now();
  await storage.set('timerStart', timestamp);
  return { timestamp };
});

resolver.define('stopActiveTimer', async () => {
  const startTime = await storage.get('timerStart');
  const endTime = Date.now();
  const duration = endTime - startTime;
  await storage.delete('timerStart');
  return { duration };
});


resolver.define('getActiveTimer', async () => {
  const timerStart = await storage.get('timerStart');
  return { isRunning: !!timerStart, startTime: timerStart };
});

resolver.define('getRemoteActiveTimer', async ({ payload }) => {
  const apiKey = await storage.get('apiKey');
  const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const url = `${baseUrl}/internal/time_entries/report?user_ids=${payload.user_id}&page=1&limit=25&order_by=time&sort_to=desc&time_zone=${time_zone}`;

  const result = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json; charset=UTF-8',
    }
  });

  await checkResponse('getRemoteActiveTimer', result);

  const activeTimer = await result.json();

  return { success: true, activeTimer };
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
