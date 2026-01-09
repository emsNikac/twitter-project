import { api } from './client';

export type UpdateUserPayload = {
  username?: string;
  picture?: string;
  bio?: string; //TODO
};

export const updateMeRequest = (payload: UpdateUserPayload) => api.patch('/users/me', payload);