export interface Tweet {
    id: string;
    creatorId: string;
    content: string;
    image: string | null;
    likesCount: number;
    retweetsCount: number;
    createdAt: Date;
    updatedAt?: Date;
}