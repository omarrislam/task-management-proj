import { request } from './client';

export const listActivity = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/activity${suffix}`);
};
