import { Injectable, NotFoundException } from '@nestjs/common';
import { Tweet } from './interface/tweet.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class TweetsService {
    private tweets: Tweet[] = [];

    create(creatorId: string, content: string, image?: string | null): Tweet{
        const now = new Date();

        const newTweet: Tweet = {
            id: randomUUID(),
            creatorId: creatorId,
            content: content,
            image: image ?? null,
            likesCount: 0,
            retweetsCount: 0,
            createdAt: now,
            updatedAt: now,
        };

        this.tweets.push(newTweet);
        return newTweet;
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
