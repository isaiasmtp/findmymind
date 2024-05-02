import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [UsersService, JwtService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
