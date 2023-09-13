import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
}

export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {

    @Prop({required: true})
    quantity: Number

    @Prop({required: true})
    price: Number

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Prop({ type: String, enum: OrderType })
    type: OrderType;

    @Prop()
    transaction_hash?: string;

    @Prop()
    transaction_raw?: string;

    @Prop()
    contract_hash?: string;

    @Prop()
    contract_raw?: string;
    
    @Prop({ type: 'ObjectId', ref: 'User', required: true })
    user_id: string; 

    @Prop({default: new Date()})
    created_at: Date;

    @Prop({default: new Date()})
    updated_at: Date;

    @Prop({})
    deleted_at?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
