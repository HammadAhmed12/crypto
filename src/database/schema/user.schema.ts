
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/})
  email: string;

  @Prop()
  password_hash: string;

  @Prop({default: new Date()})
  created_at: Date;

  @Prop({default: new Date()})
  updated_at: Date;

  @Prop({})
  deleted_at?: Date;

  @Prop()
  wallet_id?: string;

  @Prop({unique: true})
  wallet_private_key?: string;

  @Prop()
  wallet_raw?: string;
  private _id: any | string;
}

export const UserSchema = SchemaFactory.createForClass(User);
