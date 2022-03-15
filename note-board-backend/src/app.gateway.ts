import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { NotesService } from './notes/notes.service';
import { UsersService } from './users/users.service';

// @WebSocketGateway(Number(process.env.GW_PORT), { непонятно, как законектитться по другому порту и с другим неймспейсом
//   namespace: process.env.GW_NAMESPACE,
//   cors: true,
// })
@WebSocketGateway({
  cors: true,
})
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly usersService: UsersService,
    private readonly notesService: NotesService,
  ) {}

  @WebSocketServer()
  private wss: Server;

  private logger: Logger = new Logger('AppGateway');
  private count = 0;

  afterInit(server: any) {
    this.logger.log('AppGateway Initialized', server);
  }

  async handleConnection(client: any) {
    this.count = this.count + 1;
    this.logger.log(`Connected: ${this.count}, Connection id: ${client.id}`);
    const notes = await this.notesService.getAll();
    client.emit('all-notes-to-client', notes);
  }

  handleDisconnect(client: any) {
    this.count = this.count - 1;
    this.logger.log(
      `Disconnected: ${this.count}, Disonnection id: ${client.id}`,
    );
  }

  @SubscribeMessage('create-note-to-server')
  async createNote(@MessageBody() data) {
    this.logger.log(`Create note`);
    const note = await this.notesService.createNote(data);
    this.wss.emit('create-note-to-client', note);
  }

  @SubscribeMessage('update-note-to-server')
  async updateNote(@MessageBody() data) {
    this.logger.log(`Update note`);
    const note = await this.notesService.updateNote(data);
    this.wss.emit('update-note-to-client', note);
  }

  @SubscribeMessage('delete-note-to-server')
  async deleteNote(@MessageBody() data) {
    this.logger.log(`Delete note`);
    const note = await this.notesService.deleteNote(data);
    this.wss.emit('delete-note-to-client', note);
  }
}
