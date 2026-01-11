import { Body, Controller, Get, Post, Param, UseGuards, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    updateMe(@Req() req: any, @Body() body: UpdateUserDto) {
        return this.usersService.updateUser(req.user.id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/profile')
    getProfile(@Req() req: any, @Param('id') id: string){
        return this.usersService.getPublicProile(id, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/follow')
    toggleFollow(@Req() req: any, @Param('id') id: string){
        return this.usersService.toggleFollow(id, req.user.id);
    }
}
