import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTweetDto } from './dto/create-tweet.dto';

@Controller('tweets')
export class TweetsController {
    constructor(private readonly tweetService: TweetsService){}


    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req: any, @Body() tweetDto: CreateTweetDto){
        return this.tweetService.create(
            req.user.id,
            tweetDto.content,
            tweetDto.image,
        );
    }

    @Get()
    findAll(){
        return this.tweetService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.tweetService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/like')
    likeTweet(@Param('id') id: string){
        return this.tweetService.increaseLikes(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/dislike')
    dislike(@Param('id') id: string){
        return this.tweetService.decreaseLikes(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/retweet')
    retweet(@Param('id') id: string){
        return this.tweetService.increaseRetweets(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/undoretweet')
    undoRetweet(@Param('id') id: string){
        return this.tweetService.decreaseRetweets(id);
    }
}
