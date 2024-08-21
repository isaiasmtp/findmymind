import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UsersService,
    private readonly mailer: MailerService,
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

  async forget(email: string) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid E-mail.');
    }

    const token = this.jwtService.sign(
      {
        id: user.email,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.email),
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailer.sendMail({
      subject: 'Recuperação de Senha',
      to: user.email,
      template: 'forget-password',
      context: {
        name: user.name,
        link: token,
      },
    });

    return {};
  }

  async reset(password: string, token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      await this.userService.updatePassword(data.id, password);
    } catch (_) {
      throw new InternalServerErrorException('Failed to update password');
    }
  }
}
