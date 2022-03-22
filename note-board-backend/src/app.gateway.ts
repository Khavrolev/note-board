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

enum SocketMessageToClient {
  GetAllNotes = 'all-notes-to-client',
  CreateNote = 'create-note-to-client',
  UpdateNote = 'update-note-to-client',
  DeleteNote = 'delete-note-to-client',
}

enum SocketMessageToServer {
  CreateNote = 'create-note-to-server',
  UpdateNote = 'update-note-to-server',
  DeleteNote = 'delete-note-to-server',
}

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
    client.emit(SocketMessageToClient.GetAllNotes, notes);
  }

  handleDisconnect(client: any) {
    this.countClients = this.countClients - 1;
    this.logger.log(
      `Disconnected: ${this.countClients}, Disonnection id: ${client.id}`,
    );
  }

  @SubscribeMessage(SocketMessageToServer.CreateNote)
  async createNote(@MessageBody() data, @ConnectedSocket() client: Socket) {
    this.logger.log(`Create note from id: ${client.id}`);
    const note = await this.notesService.createNote(data);
    this.wss.emit(SocketMessageToClient.CreateNote, note);
  }

  @SubscribeMessage(SocketMessageToServer.UpdateNote)
  async updateNote(@MessageBody() data, @ConnectedSocket() client: Socket) {
    this.logger.log(`Update note from id: ${client.id}`);
    const note = await this.notesService.updateNote(data);
    client.broadcast.emit(SocketMessageToClient.UpdateNote, note);
  }

  @SubscribeMessage(SocketMessageToServer.DeleteNote)
  async deleteNote(@MessageBody() data, @ConnectedSocket() client: Socket) {
    this.logger.log(`Delete note from id: ${client.id}`);
    const note = await this.notesService.deleteNote(data);
    this.wss.emit(SocketMessageToClient.DeleteNote, note);
  }
}
