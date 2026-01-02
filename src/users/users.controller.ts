import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService){}

    @Get()
    findAll(){
        return this.usersService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string){
        return this.usersService.findWholeUser(id);
    }

    @Post()
    async create(@Body() userDto: CreateUserDto){
        return this.usersService.create(userDto);
    }

}
