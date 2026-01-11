import { createContext, useContext, useEffect, useState } from "react";
import {
  createTweetRequest,
  getFeedRequest,
  toggleLikeRequest,
  toggleRetweetRequest,
  TweetDTO,
} from "../api/tweets.api";
import { useAuth } from "./AuthContext";

export type Tweet = TweetDTO;

type TweetsContextType = {
  tweets: Tweet[];
  loadTweets: () => Promise<void>;
  createTweet: (content: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  toggleRetweet: (originalId: string) => Promise<void>;
};

const TweetsContext = createContext<TweetsContextType | null>(null);

export function TweetsProvider({ children }: { children: React.ReactNode }) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    setTweets(prev =>
      prev.map(tweet =>
        tweet.creator?.id === user.id
          ? {
            ...tweet,
            creator: {
              ...tweet.creator,
              username: user.username,
              picture: user.picture ?? tweet.creator.picture,
            },
          }
          : tweet
      )
    );
  }, [user]);


  const loadTweets = async () => {
    const result = await getFeedRequest();
    setTweets(result.data);
  };

  const createTweet = async (content: string) => {
    const result = await createTweetRequest(content);
    setTweets(prev => [result.data, ...prev]);
  };

  const replaceTweet =
    (updated: Tweet) => (tweet: Tweet) => {
      if (tweet.id === updated.id) return updated;
      if (
        tweet.type === 'RETWEET' &&
        tweet.originalTweet?.id === updated.id
      ) {
        return {
          ...tweet,
          likesCount: updated.likesCount,
          isLikedByMe: updated.isLikedByMe,
        };
      }

      return tweet;
    };

  const toggleLike = async (id: string) => {
    const result = await toggleLikeRequest(id);
    setTweets(prev => prev.map(replaceTweet(result.data)));
  };

  const toggleRetweet = async (originalId: string) => {
    await toggleRetweetRequest(originalId);
    await loadTweets();
  };

  return (
    <TweetsContext.Provider
      value={{ tweets, loadTweets, createTweet, toggleLike, toggleRetweet }}
    >
      {children}
    </TweetsContext.Provider>
  );
}

export function useTweets() {
  const tweetContext = useContext(TweetsContext);
  if (!tweetContext) throw new Error('useTweets must be used inside TweetsProvider');
  return tweetContext;
}