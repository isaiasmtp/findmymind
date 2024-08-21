import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigAsync } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfigAsync } from './configs/mailer.config';
import { throttlerConfig } from './configs/config';

const ThrottlerProvide = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot(throttlerConfig),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    MailerModule.forRootAsync(mailerConfigAsync),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, ThrottlerProvide],
  exports: [],
})
export class AppModule {}
