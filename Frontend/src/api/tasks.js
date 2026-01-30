import { request } from './client';

export const listTasks = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/tasks${suffix}`);
};

export const getTask = (id) => request(`/tasks/${id}`);
export const createTask = (payload) => request('/tasks', {
  method: 'POST',
  body: JSON.stringify(payload),
});
export const updateTask = (id, payload) => request(`/tasks/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(payload),
});
export const deleteTask = (id) => request(`/tasks/${id}`, {
  method: 'DELETE',
});
