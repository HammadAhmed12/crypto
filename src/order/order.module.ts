import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Order } from '../database/schema/order.schema';
import { CurrencyService } from 'src/currency/currency.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Module({
  imports:[
    MongooseModule.forFeature(
      [
        {name: Order.name, schema: OrderSchema }
      ]
    )
  ],
  controllers: [OrderController],
  providers: [OrderService, CurrencyService, WebsocketGateway],
})
export class OrderModule {}
