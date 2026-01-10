import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Tweet } from './interface/tweet.interface';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';

export type TweetWithCreator = {
    id: string;
    type: 'ORIGINAL' | 'RETWEET',

    content?: string;
    picture?: string | null;

    originalTweet?: {
        id: string;
        content: string;
        picture: string | null;
        creator: {
            id: string;
            username: string;
            picture: string | null;
        };
    };

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

    create(creatorId: string, content: string, picture?: string | null) {
        const now = new Date();

        const newTweet: Tweet = {
            id: randomUUID(),
            creatorId,

            type: 'ORIGINAL',
            content,
            picture: picture ?? null,

            likes: new Set(),
            retweets: new Set(),
            createdAt: now,
            updatedAt: now,
        };

        this.tweets.push(newTweet);
        return this.toTweetWithCreator(newTweet, creatorId);
    }

    private toTweetWithCreator(tweet: Tweet, viewerId?: string): TweetWithCreator {
        const creator = this.usersService.findPublicUserById(tweet.creatorId);

        if (tweet.type === 'RETWEET') {
            const original = this.findRaw(tweet.originalTweetId!);
            const originalCreator = this.usersService.findPublicUserById(original.creatorId);

            return {
                id: tweet.id,
                type: 'RETWEET',

                createdAt: tweet.createdAt,
                updatedAt: tweet.updatedAt,

                likesCount: original.likes.size,
                retweetsCount: original.retweets.size,
                isLikedByMe: viewerId ? original.likes.has(viewerId) : false,
                isRetweetedByMe: viewerId ? original.retweets.has(viewerId) : false,

                creator: {
                    id: creator.id,
                    username: creator.username,
                    picture: creator.picture ?? null,
                },

                originalTweet: {
                    id: original.id,
                    content: original.content!,
                    picture: original.picture,
                    creator: {
                        id: originalCreator.id,
                        username: originalCreator.username,
                        picture: originalCreator.picture ?? null,
                    },
                },
            };
        }

        return {
            id: tweet.id,
            type: 'ORIGINAL',

            content: tweet.content!,
            picture: tweet.picture,

            createdAt: tweet.createdAt,
            updatedAt: tweet.updatedAt,

            likesCount: tweet.likes.size,
            retweetsCount: tweet.retweets.size,
            isLikedByMe: viewerId ? tweet.likes.has(viewerId) : false,
            isRetweetedByMe: viewerId ? tweet.retweets.has(viewerId) : false,

            creator: {
                id: creator?.id ?? 'unknown',
                username: creator?.username ?? 'unknown',
                picture: creator?.picture,
            },
        };
    }

    toggleRetweetPointer(originalTweetId: string, userId: string): TweetWithCreator {
        const original = this.findRaw(originalTweetId);

        if (original.type !== 'ORIGINAL') throw new BadRequestException('Retweet target must be an ORIGINAL tweet');
        if (original.creatorId === userId) throw new BadRequestException('You cannot retweet your own tweet');

        const alreadyRetweeted = original.retweets.has(userId);

        if (alreadyRetweeted) {
            original.retweets.delete(userId);
            original.updatedAt = new Date();

            this.deleteMyRetweetPost(originalTweetId, userId);
        } else {
            original.retweets.add(userId);
            original.updatedAt = new Date();

            const now = new Date();
            const retweet: Tweet = {
                id: randomUUID(),
                creatorId: userId,

                type: 'RETWEET',
                originalTweetId,

                content: null,
                picture: null,

                likes: new Set(),
                retweets: new Set(),

                createdAt: now,
                updatedAt: now,
            };

            this.tweets.push(retweet);
        }

        return this.toTweetWithCreator(original, userId);
    }

    private deleteMyRetweetPost(originalTweetId: string, userId: string) {
        const index = this.tweets.findIndex(
            tweet =>
                tweet.type === 'RETWEET' &&
                tweet.creatorId === userId &&
                tweet.originalTweetId === originalTweetId,
        );

        if (index !== -1) {
            this.tweets.splice(index, 1);
        }
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
}
