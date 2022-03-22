import { DraggableData } from "react-draggable";
import { Socket } from "socket.io-client";
import { NoteInterface } from "../interfaces/NoteInterface";
import { UserInterface } from "../interfaces/UserInterface";
import { getRandomColor } from "./getColor";

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

const createNote = (socket: Socket, note: CreateNote) => {
  socket.emit(SocketMessageToServer.CreateNote, note);
};

const updateNote = (socket: Socket, note: NoteInterface) => {
  socket.emit(SocketMessageToServer.UpdateNote, note);
};

export const deleteNote = (socket: Socket, id: number) => {
  socket.emit(SocketMessageToServer.DeleteNote, id);
};

export const changePosition = (
  socket: Socket,
  data: DraggableData,
  currentNote: NoteInterface,
  setCurrentNote: (currentNote: NoteInterface) => void
) => {
  const newNote = {
    ...currentNote,
    top: data.y,
    left: data.x,
  };
  updateNote(socket, newNote);
  setCurrentNote(newNote);
};

export const changeText = (
  socket: Socket,
  event: any,
  currentNote: NoteInterface,
  setCurrentNote: (currentNote: NoteInterface) => void
) => {
  const newNote = { ...currentNote, text: event.target.value };
  updateNote(socket, newNote);
  setCurrentNote(newNote);
};

export const createNewNote = (
  socket: Socket,
  event: any,
  user: UserInterface
) => {
  if (event.target !== event.currentTarget) {
    return;
  }
  createNote(socket, {
    text: "",
    userName: user?.name,
    color: getRandomColor(),
    top: event.clientY - event.target.offsetTop,
    left: event.clientX - event.target.offsetLeft,
  });
};
