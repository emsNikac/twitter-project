export interface User{
    id: string;
    username: string;
    email: string;
    passwordHashed: string;
    picture: string | null;

    followers: Set<string>;
    following: Set<string>;

    createdAt: Date;
    updatedAt?: Date;
}

