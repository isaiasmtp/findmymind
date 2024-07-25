import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString, MinLength } from 'class-validator';

export class AuthResetDTO {
  @IsString()
  @MinLength(6)
  @ApiProperty({ default: '123456', required: true })
  password: string;

  @IsJWT()
  @ApiProperty({ default: 'JWT', required: true })
  token: string;
}
