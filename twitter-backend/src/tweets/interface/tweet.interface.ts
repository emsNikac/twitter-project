export interface Tweet {
    id: string;
    creatorId: string;
    
    type: 'ORIGINAL' | 'RETWEET';
    originalTweetId?: string;
    
    content: string | null;
    picture: string | null;


    likes: Set<string>;
    retweets: Set<string>;
    
    createdAt: Date;
    updatedAt?: Date;
}