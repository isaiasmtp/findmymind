import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  @ApiProperty({ default: 'email@email.com', required: true })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ default: '123456', required: true })
  password: string;

  @IsString()
  @ApiProperty({ default: 'John Doe', required: true })
  name: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ default: '2020-07-10', required: true })
  birthAt?: string;
}
