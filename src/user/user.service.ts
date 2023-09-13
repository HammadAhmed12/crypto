import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from '../shared/utility/hash';
import { InjectModel } from '@nestjs/mongoose';
import {User, UserSchema} from '../database/schema/user.schema'
import { Model } from 'mongoose';
import { Wallet } from 'ethers';
import  {EncryptionService} from '../shared/encryption'

const ethers = require('ethers')

@Injectable()
export class UserService {
  constructor(
    private hashService: HashService,
    private encryptionService: EncryptionService,
    @InjectModel(User.name)
    private userModel: Model<User>
  ){}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword= await this.hashService.hash(createUserDto.password); 
    const randomPrivateKey = this.encryptionService.generateRandomHex()
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545'); // Local Ganache node

    const wallet = new Wallet(randomPrivateKey, provider);

    return await this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password_hash: hashedPassword,
      wallet_id: wallet.address,
      wallet_private_key: randomPrivateKey,
      wallet_raw: JSON.stringify(wallet)
    })
  }

  async validatePassword(hashedPassword: string, password: string): Promise<boolean>{
    return await this.hashService.compareWithHash(password, hashedPassword)
  }


  async findOne(id: String, email: String, password: String){
    return await this.userModel.findOne({
      _id: id,
      password_hash: password,
      email: email
    })
  }

  async remove(id: string) {
    return await this.userModel.deleteOne({_id: id});
  }
}
