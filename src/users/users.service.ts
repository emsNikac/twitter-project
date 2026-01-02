import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';

import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';


type CreateUserInternal = {
    username: string;
    email: string;
    passwordEncoded: string;
    picture?: string | null;
}


@Injectable()
export class UsersService {
    private users: User[] = [];


    findWholeUser(id: string): User | undefined{
        return this.users.find(u => u.id === id);
    }

    findAll(): Omit<User, 'passwordEncoded'>[]{
        return this.users.map(({passwordEncoded, ...cleanUser}) => cleanUser);
    }
    
    findOne(id: string): Omit<User, 'passwordEncoded'>{
        const user = this.users.find(u => u.id === id);
        if (!user) throw new NotFoundException(`User with id ${id} not found.`);
        const {passwordEncoded, ...cleanUser} = user;
        return cleanUser;
    }

    findByEmail(email: string): User | undefined {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    findByUsername(username: string): User | undefined {
        return this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    }

    async create(dto: CreateUserDto): Promise<Omit<User, 'passwordEncoded'>>{
        if(this.findByEmail(dto.email)){
            throw new ConflictException("Email already exists");
        }

        if(this.findByUsername(dto.username)){
            throw new ConflictException("Username already exists");
        }

        const passwordEncoded = await bcrypt.hash(dto.password, 10);

        const user = this.createInternal({
            username: dto.username,
            email: dto.email,
            passwordEncoded,
            picture: dto.picture,
        });

        const {passwordEncoded: _, ...cleanUser} = user;
        return cleanUser;
    }


    createInternal(data: CreateUserInternal){
        const existingMail = this.findByEmail(data.email);
        const username = this.findByUsername(data.username);
        if(existingMail) throw new ConflictException("Email already exists");
        if(username) throw new ConflictException("Username already exists");
        
        const now = new Date();

        const newUser: User = {
            id: randomUUID(),
            username: data.username,
            email: data.email,
            passwordEncoded: data.passwordEncoded,
            picture: data.picture ?? null,
            createdAt: now,
            updatedAt: now,
        };

        this.users.push(newUser);
        return newUser;
    }

}
