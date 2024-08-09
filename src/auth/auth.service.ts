import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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

  async createToken(user: UserEntity, audience: string, issuer: string, expiresIn: string) {
    const token = this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
      },
      {
        expiresIn,
        audience,
        issuer,
      },
    );

    return { token: token };
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  verifyToken(token: string, audience: string, issuer: string) {
    try {
      return this.jwtService.verify(token, {
        audience: audience,
        issuer: issuer,
      });
    }
    catch (e) {
      throw new BadRequestException(e)
    }
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
      return this.createToken(user, 'users', 'login', '7 days');
    } else {
      throw new UnauthorizedException();
    }
  }

  async forget(email: string) {

  }

  async reset(password: string, token: string) {
    
  }
}
