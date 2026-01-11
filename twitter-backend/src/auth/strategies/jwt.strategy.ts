import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: { sub: string, email: string }) {
        const user = await this.authService.getUserFromTokenPayload(payload);

        return {
            id: payload.sub,
            username: user.username,
            email: user.email,
            picture: user.picture ?? null,
        };
    }
}