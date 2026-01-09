import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){}

    async register(registerDto: RegisterDto){
        const user = await this.usersService.create(registerDto);
        const token = await this.signToken(user.id, user.email);
        return { user, access_token: token };
    }

    async validateUser(email: string, password: string){
        const user = await this.usersService.findByEmail(email);
        if(!user) return null;

        const check_password = await  bcrypt.compare(password, user.passwordHashed);
        if(!check_password) return null;

        const {passwordHashed: _, ...cleanUser} = user;
        return cleanUser;
    }

    async login (user: {id: string; email: string}){
        const token  = await this.signToken(user.id, user.email);
        return {access_token: token};
    }

    private async signToken(userId: string, email: string){
        return this.jwtService.signAsync({sub: userId, email});
    }

    async getUserFromTokenPayload(payload: { sub: string; email: string }){
        const user = await this.usersService.findByEmail(payload.email);
        if(!user || user.id !== payload.sub) throw new UnauthorizedException();
        const {passwordHashed: _, ...cleanUser} = user;
        return cleanUser; 
    }

}
