import Resolver from '@forge/resolver';
import { storage, fetch } from '@forge/api';
import { checkResponse } from './utils/checkResponse';
const resolver = new Resolver();

// const baseUrl = 'https://scrumteams.herokuapp.com/v2';
const baseUrl = 'https://scrumlaunch-teams-dev.herokuapp.com/v2';

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

    if (result.ok) {
      await storage.set('apiKey', payload.apiKey);
    } else {
      await storage.delete('apiKey');
    }

    return { success: result.ok };

  } catch (error) {
    await storage.delete('apiKey');
    return { success: false };
  }
});

resolver.define('resetApiKey', async () => {
  await storage.delete('apiKey');
  return { success: true };
});

resolver.define('startTimer', async (req) => {
  const timestamp = Date.now();
  await storage.set('timerStart', timestamp);
  return { timestamp };
});

resolver.define('stopTimer', async () => {
  const startTime = await storage.get('timerStart');
  const endTime = Date.now();
  const duration = endTime - startTime;
  await storage.delete('timerStart');
  return { duration };
});

resolver.define('getTimerStatus', async () => {
  const timerStart = await storage.get('timerStart');
  return { isRunning: !!timerStart, startTime: timerStart };
});

export const handler = resolver.getDefinitions();
