const isDebug = true;
const siteUrl = isDebug ?  'https://scrumteamstest.web.app' : 'https://teams.scrumlaunch.com';
const baseUrl = isDebug ? 'https://scrumlaunch-teams-dev.herokuapp.com/v2/external' : 'https://scrumteams.herokuapp.com/v2/external';

export { siteUrl, baseUrl };