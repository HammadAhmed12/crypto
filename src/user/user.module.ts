import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashService } from '../shared/utility/hash';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schema/user.schema'
import { EncryptionService } from '../shared/encryption';

@Module({
  imports:[
    MongooseModule.forFeature(
      [
        {name: User.name, schema: UserSchema }
      ]
    )
  ],
  controllers: [UserController],
  providers: [UserService, HashService, EncryptionService],
})
export class UserModule {}
