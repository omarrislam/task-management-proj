import { request } from './client';

export const login = (payload) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const register = (payload) => request('/auth/register', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const me = () => request('/auth/me');
