import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

    findPublicUserById(id: string): {
        id: string;
        username: string;
        picture: string | null;
    } {
        const user = this.users.find(u => u.id === id);
        if (!user) throw new NotFoundException(`User with id ${id} not found`);

        return {
            id: user.id,
            username: user.username,
            picture: user.picture ?? null,
        };
    }

    async create(dto: CreateUserDto): Promise<Omit<User, 'passwordHashed'>> {
        if (this.findByEmail(dto.email)) {
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

            followers: new Set(),
            following: new Set(),
        };

        this.users.push(newUser);
        return newUser;
    }

    updateUser(userId: string, updates: Partial<User>){
        const user = this.users.find(u => u.id === userId);
        if(!user) throw new NotFoundException(`User with id ${userId} not found`);

        Object.assign(user, updates);
        user.updatedAt = new Date();

        const {passwordHashed, ...cleanUser } = user;
        return cleanUser;
    }

    getPublicProile(targetUserId: string, viewerId?: string){
        const user = this.users.find(user => user.id === targetUserId);
        if(!user) throw new NotFoundException('User not found;');

        return {
            id: user.id,
            username: user.username,
            picture: user.picture,

            followersCount: user.followers.size,
            followingCount: user.following.size,
            isFollowedByMe: viewerId ? user.followers.has(viewerId) : false,
        };
    }

    toggleFollow(targetUserId: string, viewerId: string){
        if (targetUserId === viewerId) throw new BadRequestException('You cannot follow yourself');

        const target = this.users.find(user => user.id === targetUserId);
        const viewer = this.users.find(user => user.id === viewerId);

        if(!target || !viewer) throw new NotFoundException('User not found');

        if(viewer.following.has(targetUserId)){
            viewer.following.delete(targetUserId);
            target.followers.delete(viewerId);
        } else {
            viewer.following.add(targetUserId);
            target.followers.add(viewerId);
        }
        viewer.updatedAt = new Date();
        target.updatedAt = new Date();

        return this.getPublicProile(targetUserId, viewerId);
    }

}
