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

export const changePosition = (socket, data, currentNote, setCurrentNote) => {
  const newNote = {
    ...currentNote,
    top: data.y,
    left: data.x,
  };
  updateNote(socket, newNote);
  setCurrentNote(newNote);
};

export const changeText = (socket, event, currentNote, setCurrentNote) => {
  const newNote = { ...currentNote, text: event.target.value };
  updateNote(socket, newNote);
  setCurrentNote(newNote);
};

export const createNewNote = (socket, event, user) => {
  if (event.target !== event.currentTarget) {
    return;
  }

  createNote(socket, {
    text: "",
    userName: user.name,
    color: getRandomColor(),
    top: event.clientY - event.target.offsetTop,
    left: event.clientX - event.target.offsetLeft,
  });
};
