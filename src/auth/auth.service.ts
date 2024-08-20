import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createToken(user: UserEntity, issuer: string, expiresIn: string) {
    const { audience, featurePermissions } = user.role;

    const token = this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
        featurePermissions,
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

  verifyToken(token: string, issuer: string) {
    try {
      return this.jwtService.verify(token, {
        issuer: issuer,
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne();
  }

  async login(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    const issuer = 'login';
    const expiresIn = '7 days';

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.createToken(user, issuer, expiresIn);
    } else {
      throw new UnauthorizedException();
    }
  }

  async forget(email: string) {}

  async reset(password: string, token: string) {}
}
