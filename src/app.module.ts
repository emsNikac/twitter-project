import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TweetsModule } from './tweets/tweets.module';

@Module({
  imports: [UsersModule, AuthModule, TweetsModule],
})
export class AppModule {}
