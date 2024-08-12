import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';

import { ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user-dto';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }

  @Get('info')
  @UseGuards(AuthGuard)
  async info(@Req() { metadata }) {
    return metadata;
  }
}
