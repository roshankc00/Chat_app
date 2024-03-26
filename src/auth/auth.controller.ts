import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-guard';
import { CurrentUser } from './decorators/currentuser.decorator';
import { User } from 'src/users/entities/users.entity';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Post('Login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {}
}
