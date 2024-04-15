import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { User } from 'src/users/entities/users.entity';

export interface TokenPayload {
  userId: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: User, response: Response) {
    const tokenPayload = {
      userId: user._id.toHexString(),
      email: user.email,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
    return {
      token,
      user,
    };
  }

  async logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }

  verifyWs(request: Request): TokenPayload {
    console.log(request.headers.cookie);
    const cookie: string[] = request.headers.cookie.split('; ');
    const authCookie = cookie.find((cookie) =>
      cookie.includes('Authentication'),
    );
    const jwt = authCookie.split('Authentication')[1];
    return this.jwtService.verify(jwt);
  }
}
