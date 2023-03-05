import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({secret:process.env.SECRET_KEY}),ConfigModule],
  controllers: [TokenController],
  providers: [TokenService]
})
export class TokenModule {}
