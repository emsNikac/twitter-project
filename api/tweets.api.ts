import { api } from './client';

export type TweetDTO = {
  id: string;
  content: string;
  picture: string | null;

  likesCount: number;
  retweetsCount: number;
  isLikedByMe: boolean;
  isRetweetedByMe: boolean;

  createdAt: string;

  creator: {
    id: string;
    username: string;
    picture: string | null;
  };
};

export const getFeedRequest = () =>
  api.get<TweetDTO[]>('/tweets');

export const createTweetRequest = (content: string) =>
  api.post<TweetDTO>('/tweets', { content });

export const toggleLikeRequest = (id: string) =>
  api.post<TweetDTO>(`/tweets/${id}/like`);

export const toggleRetweetRequest = (id: string) =>
  api.post<TweetDTO>(`/tweets/${id}/retweet`);