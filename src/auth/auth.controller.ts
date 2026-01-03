import { Body, Post, Controller, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Body() loginDto: LoginDto, @Req() req: any){
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req()req: any){
        return req.user;
    }
}
