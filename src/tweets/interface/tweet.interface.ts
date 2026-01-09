export interface Tweet {
    id: string;
    creatorId: string;
    content: string;
    picture: string | null;
    likes: Set<string>;
    retweets: Set<string>;
    createdAt: Date;
    updatedAt?: Date;
}