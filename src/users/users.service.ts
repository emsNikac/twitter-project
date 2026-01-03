import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';

import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';


type CreateUserInternal = {
    username: string;
    email: string;
    passwordHashed: string;
    picture?: string | null;
}


@Injectable()
export class UsersService {
    private users: User[] = [];

    findAll(): Omit<User, 'passwordHashed'>[]{
        return this.users.map(({passwordHashed, ...cleanUser}) => cleanUser);
    }
    
    findOne(id: string): Omit<User, 'passwordHashed'>{
        const user = this.users.find(u => u.id === id);
        if (!user) throw new NotFoundException(`User with id ${id} not found.`);
        const {passwordHashed, ...cleanUser} = user;
        return cleanUser;
    }

    findByEmail(email: string): User | undefined {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    findByUsername(username: string): User | undefined {
        return this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    }

    async create(dto: CreateUserDto): Promise<Omit<User, 'passwordHashed'>>{
        if(this.findByEmail(dto.email)){
            throw new ConflictException("Email already exists");
        }

        if(this.findByUsername(dto.username)){
            throw new ConflictException("Username already exists");
        }

        const passwordHashed = await bcrypt.hash(dto.password, 10);

        const user = this.createInternal({
            username: dto.username,
            email: dto.email,
            passwordHashed,
            picture: dto.picture,
        });

        const {passwordHashed: _, ...cleanUser} = user;
        return cleanUser;
    }


    createInternal(data: CreateUserInternal){        
        const now = new Date();

        const newUser: User = {
            id: randomUUID(),
            username: data.username,
            email: data.email,
            passwordHashed: data.passwordHashed,
            picture: data.picture ?? null,
            createdAt: now,
            updatedAt: now,
        };

        this.users.push(newUser);
        return newUser;
    }

}
