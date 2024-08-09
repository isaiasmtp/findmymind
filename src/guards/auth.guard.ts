import { CanActivate, ExecutionContext, Injectable} from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ){}

    async canActivate(context: ExecutionContext) {

        const request = context.switchToHttp().getRequest()
        const { authorization } = request.headers
        const token = (authorization ?? "").split(" ")[1]

        try{
            const metadata = this.authService.verifyToken(token, "", "")
            request.metadata = metadata            
            return true;
        } catch (e) {
            return false;
        }
    }
}