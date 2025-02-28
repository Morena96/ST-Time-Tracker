import { requestJira } from "@forge/bridge";

export const requestIssueData = async (boardId) => {
    const response = await requestJira(`/rest/agile/1.0/board/${boardId}/issue`);
    return await response.json();
  };
  