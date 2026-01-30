import { request } from './client';

export const listComments = (taskId) => request(`/tasks/${taskId}/comments`);
export const createComment = (taskId, payload) => request(`/tasks/${taskId}/comments`, {
  method: 'POST',
  body: JSON.stringify(payload),
});
