import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthLoginDTO {
  @IsEmail()
  @ApiProperty({ default: 'email@email.com', required: true })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ default: '123456', required: true })
  password: string;
}
