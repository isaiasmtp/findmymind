import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export default class JwtConfig {
  static getJwtConfig(): JwtModuleOptions {
    return {
      secret: process.env.JWT_SECRET,
    };
  }
}

export const JwtConfigAsync: JwtModuleAsyncOptions = {
  useFactory: async (): Promise<JwtModuleAsyncOptions> =>
    JwtConfig.getJwtConfig(),
};
