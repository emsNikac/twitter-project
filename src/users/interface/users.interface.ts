export interface User{
    id: string;
    username: string;
    email: string;
    passwordHashed: string;
    picture: string | null;
    createdAt: Date;
    updatedAt?: Date;
}

