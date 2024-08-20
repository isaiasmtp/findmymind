import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';

import { ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user-dto';
import { Metadata } from 'src/decorators/metadata.decorator';
import { Features } from 'src/decorators/feature.decorator';
import { FeatureGuard } from 'src/guards/feature.guard';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }

  @Features('SHOW_INFO_USERS', 'SHOW_MY_USER')
  @UseGuards(FeatureGuard)
  @UseGuards(AuthGuard)
  @Get('info')
  async info(@Metadata() metadata: any) {
    return metadata;
  }
}
