import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { HashService } from '../shared/utility/hash';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { EncryptionService } from '../shared/encryption';
require('dotenv').config();


@Module({
  imports:[
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6000s' },
    }),
    MongooseModule.forFeature(
      [
        {
          name: User.name, schema: UserSchema
        }
      ]
    )
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, HashService, EncryptionService, JwtStrategy],
})
export class AuthModule {}
