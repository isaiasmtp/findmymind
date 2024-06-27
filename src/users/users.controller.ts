import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user-dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }
}
