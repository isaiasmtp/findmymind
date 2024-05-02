import { IsDateString, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDTO{

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsString()
    name: string

    @IsOptional()
    @IsDateString()
    birthAt: string
}