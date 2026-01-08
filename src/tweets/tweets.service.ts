import { Injectable, NotFoundException } from '@nestjs/common';
import { Tweet } from './interface/tweet.interface';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';

export type TweetWithCreator = Tweet & {
    creator: {
        id: string,
        username: string,
        picture: string | null;
    };
};

@Injectable()
export class TweetsService {
    constructor(private readonly usersService: UsersService){}
    private tweets: Tweet[] = [];

    create(creatorId: string, content: string, picture?: string | null): Tweet{
        const now = new Date();

        const newTweet: Tweet = {
            id: randomUUID(),
            creatorId,
            content,
            picture: picture ?? null,
            likesCount: 0,
            retweetsCount: 0,
            createdAt: now,
            updatedAt: now,
        };

        this.tweets.push(newTweet);
        return newTweet;
    }

    private toTweetWithCreator(tweet: Tweet): TweetWithCreator{
        const user = this.usersService.findPublicUserById(tweet.creatorId);
        return {
            ...tweet,
            creator: {
                id: tweet.creatorId,
                username: user?.username ?? 'unknown',
                picture: user?.picture ?? 'null',
            },
        };
    }

    findAll(): Tweet[]{
        return this.tweets.sort((tweet_a, tweet_b) => tweet_b.createdAt.getTime() - tweet_a.createdAt.getTime());
    }

    findOne(id: string): Tweet{
        const tweetToReturn = this.tweets.find(t => t.id === id);
        if(!tweetToReturn) throw new NotFoundException(`Tweet with id ${id} not found`);
        return tweetToReturn;
    }

    increaseLikes(id: string): Tweet{
        const tweet = this.findOne(id);
        tweet.likesCount += 1;
        tweet.updatedAt = new Date();
        return tweet;
    }

    decreaseLikes(id: string): Tweet{
        const tweet = this.findOne(id);
        tweet.likesCount = Math.max(0, tweet.likesCount - 1);
        tweet.updatedAt = new Date();
        return tweet;
    }

    increaseRetweets(id: string): Tweet{
        const tweet = this.findOne(id);
        tweet.retweetsCount += 1;
        tweet.updatedAt = new Date();
        return tweet;
    }

    decreaseRetweets(id: string): Tweet{
        const tweet = this.findOne(id);
        tweet.retweetsCount = Math.max(0, tweet.retweetsCount - 1);
        tweet.updatedAt = new Date();
        return tweet;
    }

}
