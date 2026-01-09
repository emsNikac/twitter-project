import { createContext, useContext, useEffect, useState } from "react";
import { createTweetRequest, getFeedRequest, toggleLikeRequest, toggleRetweetRequest, TweetDTO } from "../api/tweets.api";
import { useAuth } from "./AuthContext";

export type Tweet = TweetDTO;

type TweetsContextType = {
  tweets: Tweet[];
  loadTweets: () => Promise<void>;
  createTweet: (content: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  toggleRetweet: (id: string) => Promise<void>;
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
    const res = await getFeedRequest();
    setTweets(res.data);
  };

  const createTweet = async (content: string) => {
    const res = await createTweetRequest(content);
    setTweets(prev => [res.data, ...prev]);
  };

  const toggleLike = async (id: string) => {
    const res = await toggleLikeRequest(id);
    setTweets(prev =>
      prev.map(t => (t.id === id ? res.data : t))
    );
  };

  const toggleRetweet = async (id: string) => {
    const res = await toggleRetweetRequest(id);
    setTweets(prev =>
      prev.map(t => (t.id === id ? res.data : t))
    );
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
    if(!tweetContext) throw new Error('useTweets must be used inside TweetsProvider');
    return tweetContext;
}