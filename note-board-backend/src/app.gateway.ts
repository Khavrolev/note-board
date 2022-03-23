import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
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
export class AppGateway implements OnGatewayConnection {
  constructor(private readonly notesService: NotesService) {}

  @WebSocketServer()
  private wss: Server;

  async handleConnection(client: any) {
    const notes = await this.notesService.getAll();
    client.emit(SocketMessageToClient.GetAllNotes, notes);
  }

  @SubscribeMessage(SocketMessageToServer.CreateNote)
  async createNote(@MessageBody() data) {
    const note = await this.notesService.createNote(data);
    this.wss.emit(SocketMessageToClient.CreateNote, note);
  }

  @SubscribeMessage(SocketMessageToServer.UpdateNote)
  async updateNote(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const note = await this.notesService.updateNote(data);
    client.broadcast.emit(SocketMessageToClient.UpdateNote, note);
  }

  @SubscribeMessage(SocketMessageToServer.DeleteNote)
  async deleteNote(@MessageBody() data) {
    const note = await this.notesService.deleteNote(data);
    this.wss.emit(SocketMessageToClient.DeleteNote, note);
  }
}
