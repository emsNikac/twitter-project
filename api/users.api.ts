import { api } from './client';

export type UpdateUserPayload = {
  username?: string;
  picture?: string;
  bio?: string; //TODO
};

export type PublicProfile = {
  id: string;
  username: string;
  picture: string | null;

  followersCount: number;
  followingCount: number;
  isFollowedByMe: boolean;
};

export const updateMeRequest = (payload: UpdateUserPayload) => 
  api.patch('/users/me', payload);

export const getUserProfileRequest = (userId: string) =>
  api.get<PublicProfile>(`/users/${userId}/profile`);

export const toggleFollowRequest = (userId: string) => {
  return api.post<PublicProfile>(`/users/${userId}/follow`);
}