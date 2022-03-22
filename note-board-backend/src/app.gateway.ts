import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { NotesService } from './notes/notes.service';

@WebSocketGateway({
  cors: true,
})
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly notesService: NotesService) {}

  @WebSocketServer()
  private wss: Server;

  private logger: Logger = new Logger('AppGateway');
  private countClients = 0;

  afterInit(server: any) {
    this.logger.log('AppGateway Initialized', server);
  }

  async handleConnection(client: any) {
    this.countClients = this.countClients + 1;
    this.logger.log(
      `Connected: ${this.countClients}, Connection id: ${client.id}`,
    );
    const notes = await this.notesService.getAll();
    client.emit('all-notes-to-client', notes);
  }

  handleDisconnect(client: any) {
    this.countClients = this.countClients - 1;
    this.logger.log(
      `Disconnected: ${this.countClients}, Disonnection id: ${client.id}`,
    );
  }

  @SubscribeMessage('create-note-to-server')
  async createNote(@MessageBody() data, @ConnectedSocket() client: Socket) {
    this.logger.log(`Create note from id: ${client.id}`);
    const note = await this.notesService.createNote(data);
    this.wss.emit('create-note-to-client', note);
  }

  @SubscribeMessage('update-note-to-server')
  async updateNote(@MessageBody() data, @ConnectedSocket() client: Socket) {
    this.logger.log(`Update note from id: ${client.id}`);
    const note = await this.notesService.updateNote(data);
    client.broadcast.emit('update-note-to-client', note);
  }

  @SubscribeMessage('delete-note-to-server')
  async deleteNote(@MessageBody() data, @ConnectedSocket() client: Socket) {
    this.logger.log(`Delete note from id: ${client.id}`);
    const note = await this.notesService.deleteNote(data);
    this.wss.emit('delete-note-to-client', note);
  }
}
