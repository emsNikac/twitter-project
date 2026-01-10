import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTweetDto } from './dto/create-tweet.dto';

@Controller('tweets')
export class TweetsController {
    constructor(private readonly tweetsService: TweetsService){}


    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req: any, @Body() tweetDto: CreateTweetDto){
        return this.tweetsService.create(
            req.user.id,
            tweetDto.content,
            tweetDto.picture,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Req() req){
        return this.tweetsService.findAll(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.tweetsService.findOne(id, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/like')
    toggleLike(@Req() req: any, @Param('id') id: string) {
        return this.tweetsService.toggleLike(id, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/retweet-toggle')
    toggleRetweetPointer(@Req() req: any, @Param('id') id: string) {
        return this.tweetsService.toggleRetweetPointer(id, req.user.id);
    }
}
