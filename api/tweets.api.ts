import { api } from './client';

export type TweetFeedItem = {
  id: string;
  creatorId: string;
  content: string;
  image: string | null;
  likesCount: number;
  retweetsCount: number;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    username: string;
    picture: string | null;
  };
};

export const getFeedRequest = () => {
  return api.get<TweetFeedItem[]>('/tweets');
};

export const likeTweetRequest = (id: string) => api.post(`/tweets/${id}/like`);
export const unlikeTweetRequest = (id: string) => api.post(`/tweets/${id}/dislike`);
export const retweetRequest = (id: string) => api.post(`/tweets/${id}/retweet`);
export const undoRetweetRequest = (id: string) => api.post(`/tweets/${id}/undoretweet`);