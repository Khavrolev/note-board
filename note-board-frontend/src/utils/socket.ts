import { Socket } from "socket.io-client";
import { NoteInterface } from "../interfaces/NoteInterface";

export enum SocketMessageToClient {
  GetAllNotes = "all-notes-to-client",
  CreateNote = "create-note-to-client",
  UpdateNote = "update-note-to-client",
  DeleteNote = "delete-note-to-client",
}

enum SocketMessageToServer {
  CreateNote = "create-note-to-server",
  UpdateNote = "update-note-to-server",
  DeleteNote = "delete-note-to-server",
}

interface CreateNote {
  userName: string;
  left: number;
  top: number;
  color: string;
  text: string;
}

export const createNote = (socket: Socket, note: CreateNote) => {
  socket.emit(SocketMessageToServer.CreateNote, note);
};

export const updateNote = (socket: Socket, note: NoteInterface) => {
  socket.emit(SocketMessageToServer.UpdateNote, note);
};

export const deleteNote = (socket: Socket, id: number) => {
  socket.emit(SocketMessageToServer.DeleteNote, id);
};
