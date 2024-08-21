import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: number): Promise<UserEntity | undefined> {
    return await this.userRepository.findOneBy({ id });
  }

  async show(id: number): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async create(data: CreateUserDTO): Promise<UserEntity | undefined> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Failed to create user');
    }

    try {
      data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
      const newUser = this.userRepository.create(data);
      const createdUser = await this.userRepository.save(newUser);
      delete createdUser.password;
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

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    try {
      const hashedPassword = await bcrypt.hash(
        newPassword,
        await bcrypt.genSalt(),
      );
      existingUser.password = hashedPassword;
      await this.userRepository.save(existingUser);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update password');
    }
  }
}
