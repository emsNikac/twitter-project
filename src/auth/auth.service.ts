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
        const passwordEncoded = await bcrypt.hash(registerDto.password, 10);

        const user = this.usersService.createInternal({
            username: registerDto.username,
            email: registerDto.email,
            passwordEncoded,
            picture: registerDto.picture ?? null,
        });

        const token = await this.signToken(user.id, user.email);
        const {passwordEncoded: _, ...cleanUser } = user;

        return { user: cleanUser, access_token: token };
    }

    async validateUser(email: string, password: string){
        const user = this.usersService.findByEmail(email);
        if(!user) return null;

        const check_password = await  bcrypt.compare(password, user.passwordEncoded);
        if(!check_password) return null;

        const {passwordEncoded: _, ...cleanUser} = user;
        return cleanUser;
    }

    async login (user: {id: string; email: string}){
        const token  = await this.signToken(user.id, user.email);
        return {access_token: token};
    }

    private async signToken(userId: string, email: string){
        return this.jwtService.signAsync({sub: userId, email});
    }

    getUserFromTokenPayload(payload: { sub: string; email: string }){
        const user = this.usersService.findByEmail(payload.email);
        if(!user || user.id !== payload.sub) throw new UnauthorizedException();
        const {passwordEncoded: _, ...cleanUser} = user;
        return cleanUser; 
    }

}
