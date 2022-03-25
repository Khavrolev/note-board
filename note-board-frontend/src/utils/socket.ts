import { io, Socket } from "socket.io-client";
import { NoteInterface } from "../interfaces/NoteInterface";

enum SocketMessageToClient {
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
  userId: string;
  left: number;
  top: number;
  color: string;
  text: string;
}

interface ServerToClientEvents {
  [SocketMessageToClient.GetAllNotes]: (arg: NoteInterface[]) => void;
  [SocketMessageToClient.CreateNote]: (arg: NoteInterface) => void;
  [SocketMessageToClient.UpdateNote]: (arg: NoteInterface) => void;
  [SocketMessageToClient.DeleteNote]: (arg: NoteInterface) => void;
}

interface ClientToServerEvents {
  [SocketMessageToServer.CreateNote]: (arg: CreateNote) => void;
  [SocketMessageToServer.UpdateNote]: (arg: NoteInterface) => void;
  [SocketMessageToServer.DeleteNote]: (arg: string) => void;
}

export let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

export const initSocket = () => {
  socket = io(
    `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`
  );
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const createNoteOnServer = (note: CreateNote) => {
  socket.emit(SocketMessageToServer.CreateNote, note);
};

export const updateNoteOnServer = (note: NoteInterface) => {
  socket.emit(SocketMessageToServer.UpdateNote, note);
};

export const deleteNoteOnServer = (id: string) => {
  socket.emit(SocketMessageToServer.DeleteNote, id);
};

export const onGetAllNotesFromServer = (
  onSuccess: (notes: NoteInterface[]) => void
) => {
  socket.on(SocketMessageToClient.GetAllNotes, onSuccess);
};

export const onCreateNoteFromServer = (
  onSuccess: (note: NoteInterface) => void
) => {
  socket.on(SocketMessageToClient.CreateNote, onSuccess);
};

export const onDeleteNoteFromServer = (
  onSuccess: (note: NoteInterface) => void
) => {
  socket.on(SocketMessageToClient.DeleteNote, onSuccess);
};

export const onUpdateNoteFromServer = (
  onSuccess: (note: NoteInterface) => void
) => {
  socket.on(SocketMessageToClient.UpdateNote, onSuccess);
};
