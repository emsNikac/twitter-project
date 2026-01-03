import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: { sub: string, email: string }){
        return this.authService.getUserFromTokenPayload(payload);
    }
}