import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createToken(user: UserEntity) {
    const token = this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
      },
      {
        expiresIn: '7 days',
        issuer: 'login',
        audience: 'users',
      },
    );

    return { token: token };
  }

  async checkToken(token: string, audience: string, issuer: string) {
    return this.jwtService.verify(token, {
      audience: audience,
      issuer: issuer,
    });
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.userRepository
      .createQueryBuilder()
      .select('*')
      .where({ email })
      .getRawOne();
  }

  async login(email: string, password: string) {
    const user = await this.getUserByEmail(email);

    if (user && password === user.password) {
      return this.createToken(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  async forget(email: string) {}

  async reset(password: string, token: string) {}
}
