export class User{
    id: string;
    username: string;
    email: string;
    passwordEncoded: string;
    picture: string | null;
    createdAt: Date;
    updatedAt?: Date;
}

