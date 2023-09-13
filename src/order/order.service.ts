import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../database/schema/user.schema';
import { Order } from '../database/schema/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CurrencyService } from '../currency/currency.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class OrderService {

  constructor(
    private currencyService: CurrencyService,
    private webSocketGateway: WebsocketGateway,
    @InjectModel(Order.name)
    private orderModel: Model<Order>
  ){}


  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    try {
      const order =  await this.orderModel.create({
        type: createOrderDto.type,
        quantity: createOrderDto.quantity,
        price: createOrderDto.price,
        status: 'PENDING',
        //@ts-ignore
        user_id: user._id
      })
      this.webSocketGateway.broadcastNewOrderMessage(JSON.stringify(order));
      return order;
    } catch (error) {
      throw new BadRequestException(error.message|| 'Unable to create order');
    }
  }

  async execute(id: string, user: User): Promise<Order>{
    try {
      const order = await this.orderModel.findById(id).populate('user_id').exec();
      if(order.status=='CONFIRMED'){
        throw new BadRequestException('Order already executed');
      }
  
      let walletTransfer;
      let contractTransfer;
      let newOrder;
      if(order.type=='BUY'){
        // create another order for user with status PENDING
        newOrder = await this.orderModel.create({
          type: 'SELL',
          quantity: order.quantity,
          price: order.price,
          status: 'PENDING',
          //@ts-ignore
          user_id: user._id
        })
        //@ts-ignore
        walletTransfer = await this.currencyService.transferEther(user.wallet_private_key, order.user_id.wallet_id, order.quantity);
        contractTransfer = await this.currencyService.setValueInContract(user.wallet_private_key, order.quantity);
  
      }
      else{
        // create another order for user with status PENDING
        newOrder = await this.orderModel.create({
          type: 'BUY',
          quantity: order.quantity,
          price: order.price,
          status: 'PENDING',
          //@ts-ignore
          user_id: user._id
        })
        //@ts-ignore
        walletTransfer = await this.currencyService.transferEther(order.user_id.wallet_private_key, user.wallet_id, order.quantity);
        //@ts-ignore
        contractTransfer = await this.currencyService.setValueInContract(order.user_id.wallet_private_key, order.quantity);
      }
      //@ts-ignore
      order.status = 'CONFIRMED';
      order.transaction_hash = walletTransfer.hash;
      order.transaction_raw = JSON.stringify(walletTransfer);
      order.contract_hash = contractTransfer.hash;
      order.contract_raw = JSON.stringify(contractTransfer);
      await order.save();
      newOrder.status = 'CONFIRMED';
      newOrder.transaction_hash = walletTransfer.hash;
      newOrder.transaction_raw = JSON.stringify(walletTransfer);
      newOrder.contract_hash = contractTransfer.hash;
      newOrder.contract_raw = JSON.stringify(contractTransfer);
      await newOrder.save();
      //@ts-ignore
      this.webSocketGateway.broadcastOrderExecutedMessage(order._id)
      return order;

    } catch (error) {
      throw new BadRequestException(error.message|| 'Unable to execute order');      
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find({
      status: 'PENDING'
    });
  }

  async findUserOrders(user: User): Promise<Order[]> {
    return await this.orderModel.find({
      //@ts-ignore
      user_id: user._id
    });
  }

}
