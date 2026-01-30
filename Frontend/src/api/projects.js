import { request } from './client';

export const listProjects = () => request('/projects');
export const getProject = (id) => request(`/projects/${id}`);
export const createProject = (payload) => request('/projects', {
  method: 'POST',
  body: JSON.stringify(payload),
});
export const updateProject = (id, payload) => request(`/projects/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(payload),
});
export const addProjectMember = (id, payload) => request(`/projects/${id}/members`, {
  method: 'POST',
  body: JSON.stringify(payload),
});
