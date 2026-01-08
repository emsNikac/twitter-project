export interface Tweet {
    id: string;
    creatorId: string;
    content: string;
    picture: string | null;
    likesCount: number;
    retweetsCount: number;
    createdAt: Date;
    updatedAt?: Date;
}