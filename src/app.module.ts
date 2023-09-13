import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WebsocketModule } from './websocket/websocket.module';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyModule } from './currency/currency.module';
import { UserModule } from './user/user.module';
import mongoose from 'mongoose';
import softDeletePlugin from './database/soft-delete.plugin';
import timestampPlugin from './database/timestamp.plugin';
require('dotenv').config();


@Module({
  imports: [
    AuthModule,
    OrderModule,
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionFactory: (connection) => {
        connection.plugin(softDeletePlugin);
        connection.plugin(timestampPlugin);
        return connection;
      }
    }),
    CurrencyModule,
    UserModule,

  ],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}
