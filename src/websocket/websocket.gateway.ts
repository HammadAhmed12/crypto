import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({cors: '*'})
export class WebsocketGateway {
  @WebSocketServer() server: Server;
  
   async broadcastNewOrderMessage(message: string) {
    console.log('Broadcasting order placed', message)
    await this.server.emit('newOrder', message); // Broadcast message to all clients
  }

  broadcastOrderExecutedMessage(message: string) {
    console.log('Broadcasting order executed', message)
    this.server.emit('orderExecuted', message); // Broadcast message to all clients
  }

}
