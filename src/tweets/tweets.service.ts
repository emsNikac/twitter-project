import { Injectable, NotFoundException } from '@nestjs/common';
import { Tweet } from './interface/tweet.interface';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';

export type TweetWithCreator = {
    id: string;
    content: string;
    picture: string | null;

    likesCount: number;
    retweetsCount: number;
    isLikedByMe: boolean;
    isRetweetedByMe: boolean;

    createdAt: Date;
    updatedAt?: Date;

    creator: {
        id: string;
        username: string;
        picture: string | null;
    };
};

@Injectable()
export class TweetsService {
    constructor(private readonly usersService: UsersService) { }
    private tweets: Tweet[] = [];

    create(creatorId: string, content: string, picture?: string | null): Tweet {
        const now = new Date();

        const newTweet: Tweet = {
            id: randomUUID(),
            creatorId,
            content,
            picture: picture ?? null,
            likes: new Set(),
            retweets: new Set(),
            createdAt: now,
            updatedAt: now,
        };

        this.tweets.push(newTweet);
        return newTweet;
    }

    private toTweetWithCreator(tweet: Tweet, viewerId?: string): TweetWithCreator {
        const user = this.usersService.findPublicUserById(tweet.creatorId);
        return {
            id: tweet.id,
            content: tweet.content,
            picture: tweet.picture,
            createdAt: tweet.createdAt,
            updatedAt: tweet.updatedAt,

            likesCount: tweet.likes.size,
            retweetsCount: tweet.retweets.size,

            isLikedByMe: viewerId ? tweet.likes.has(viewerId) : false,
            isRetweetedByMe: viewerId ? tweet.retweets.has(viewerId) : false,

            creator: {
                id: user?.id ?? 'unknown',
                username: user?.username ?? 'unknown',
                picture: user?.picture,
            },
        };
    }

    findAll(viewerId?: string): TweetWithCreator[] {
        return this.tweets
            .sort((tweet_a, tweet_b) => tweet_b.createdAt.getTime() - tweet_a.createdAt.getTime())
            .map(tweet => this.toTweetWithCreator(tweet, viewerId));
    }

    private findRaw(id: string): Tweet {
        const tweet = this.tweets.find(t => t.id === id);
        if (!tweet) {
            throw new NotFoundException(`Tweet with id ${id} not found`);
        }
        return tweet;
    }

    findOne(id: string, viewerId?: string): TweetWithCreator {
        const tweetToReturn = this.findRaw(id);
        if (!tweetToReturn) throw new NotFoundException(`Tweet with id ${id} not found`);
        return this.toTweetWithCreator(tweetToReturn, viewerId);
    }

    toggleLike(tweetId: string, userId: string) {
        const tweet = this.findRaw(tweetId);
        if (tweet.likes.has(userId)) {
            tweet.likes.delete(userId);
        } else {
            tweet.likes.add(userId);
        }
        tweet.updatedAt = new Date();
        return this.toTweetWithCreator(tweet, userId);
    }

    toggleRetweet(tweetId: string, userId: string): TweetWithCreator {
        const tweet = this.findRaw(tweetId);

        if (tweet.retweets.has(userId)) {
            tweet.retweets.delete(userId);
        } else {
            tweet.retweets.add(userId);
        }

        tweet.updatedAt = new Date();
        return this.toTweetWithCreator(tweet, userId);
    }

}
