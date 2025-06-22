import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server

  // Lắng nghe sự kiện 'send-message' từ phía client
  @SubscribeMessage('send-message')
  handleEvent(@MessageBody() data: string): string {
    // Khi nhận được message, phát ngược lại tới tất cả client (bao gồm cả sender)
    this.server.emit('receive-message', {
      data: `Hello ${data}`, // Gửi lại thông điệp đã nhận kèm lời chào
    })

    return data
  }
}
