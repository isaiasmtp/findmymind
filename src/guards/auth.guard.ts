import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  guard = 'login';

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const url = request.originalUrl;
    const { authorization } = request.headers;
    const token = (authorization ?? '').split(' ')[1];

    try {
      const metadata = this.authService.verifyToken(token, this.guard);

      if (this.isAudienceValid(url, metadata.aud)) {
        request.metadata = metadata;
        return true;
      }
    } catch (_) {
      return false;
    }

    return false;
  }

  private isAudienceValid(url: string, audience: string[]): boolean {
    const normalizedUrl = url.replace(/\/$/, '');

    return audience.some((aud) => {
      if (aud === '*') {
        return true;
      }

      const audPattern = aud.replace(/\*/g, '.*').replace(/\/\*$/, '.*');
      const regex = new RegExp(`^${audPattern}$`);
      return regex.test(normalizedUrl);
    });
  }
}
