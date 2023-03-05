import { Controller, Get } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';

@Controller("/airbnb")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwt: JwtService
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
