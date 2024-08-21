import { MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';

export default class MailerConfig {
  static getMailerConfig(): MailerOptions {
    return {
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM,
      },
      template: {
        dir: __dirname + '/../templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}

export const mailerConfigAsync: MailerAsyncOptions = {
  useFactory: async (): Promise<MailerOptions> =>
    MailerConfig.getMailerConfig(),
};
