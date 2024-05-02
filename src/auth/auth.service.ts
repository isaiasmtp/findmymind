import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService
    ){}

    async generateToken(){}

    async validateToken(){}

    async login(email: string, password: string){
        return {"sucesss": "ok"}
    }

    async forget(email: string){}

    async reset(password: string, token: string){}

}