import { getRandomColor } from "./getColor";

const createNote = (socket, note) => {
  socket.emit("create-note-to-server", note);
};

const updateNote = (socket, note) => {
  socket.emit("update-note-to-server", note);
};

export const deleteNote = (socket, id) => {
  socket.emit("delete-note-to-server", id);
};

export const changePosition = (socket, data, currentNote) => {
  updateNote(socket, {
    ...currentNote,
    top: currentNote.top + data.y,
    left: currentNote.left + data.x,
  });
};

export const changeText = (socket, event, currentNote) => {
  updateNote(socket, {
    ...currentNote,
    text: event.target.value,
  });
};

export const createNewNote = (socket, event, user) => {
  if (event.target !== event.currentTarget) {
    return;
  }

  createNote(socket, {
    text: "",
    userName: user.name,
    color: getRandomColor(),
    top: event.clientY,
    left: event.clientX - event.target.offsetLeft,
  });
};
