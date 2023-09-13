import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EncryptionService } from "../shared/encryption";
import { UserService } from "../user/user.service";
import {User} from '../database/schema/user.schema'

require('dotenv').config();


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private userService: UserService,
        private encyptionService: EncryptionService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: {
            id: string,
            password: string,
            email: string
        }):Promise<User>
    {
        const user = await this.userService.findOne(
            payload.id,
            this.encyptionService.decrypt(payload.email),
            this.encyptionService.decrypt(payload.password)
        )
        
        if(!user){
        throw new UnauthorizedException();
        }
        
        
        return user;
    }
}