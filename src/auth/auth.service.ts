import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/sign-up.dto';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../database/schema/user.schema';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from '../shared/encryption';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
    private encryptionService: EncryptionService,
    @InjectModel(User.name)
    private userModel = Model<User>
    ) {}

  async create(signUpDto: SignupDto) {
    if(signUpDto.password !== signUpDto.passwordConfirm) {
       throw new BadRequestException('Passwords do not match.');
    }
    const user = await this.userModel.findOne(
      {email : signUpDto.email}
    )
    if(user){
      throw new BadRequestException('This email is already taken.');
    }
    return this.usersService.create(signUpDto);
  }

  async login(loginDto: LoginDto): Promise<User>{
    const user = await this.userModel.findOne(
      {
        email: loginDto.email
      }
    )

    if(!user){
      throw new BadRequestException('Email and/or password incorrect');
    }
    const isValidPassword = await this.usersService.validatePassword(user.password_hash, loginDto.password)
    if(!isValidPassword){
      throw new BadRequestException('Email and/or password incorrect');

    }
    const jwtToken = await this.jwtService.sign({
      id: user._id,
      email: this.encryptionService.encrypt(user.email),
      password:this.encryptionService.encrypt(user.password_hash)
    })
    return {
      ...user, 
      accessToken: jwtToken
    }
  }
}
