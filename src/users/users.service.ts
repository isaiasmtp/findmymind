import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: number): Promise<UserEntity | undefined> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(data: CreateUserDTO): Promise<UserEntity | undefined> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('O email já está em uso');
    }

    try {
      const newUser = this.userRepository.create(data);
      const createdUser = await this.userRepository.save(newUser);
      return createdUser;
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async update(updateUserDto: any) {
    const existingUser = await this.userRepository.findOne({
      where: { id: updateUserDto.id },
    });

    try {
      this.userRepository.merge(existingUser, updateUserDto);
      const updatedUser = await this.userRepository.save(existingUser);
      return { id: updatedUser.id };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
