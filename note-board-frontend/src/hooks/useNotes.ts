import { useEffect, useState } from "react";
import { NoteInterface } from "../interfaces/NoteInterface";
import {
  disconnectSocket,
  initSocket,
  socket,
  SocketMessageToClient,
} from "../utils/socket";

export const useNotes = () => {
  const [notes, setNotes] = useState<NoteInterface[]>([]);

  const changeNotes = (newNote: NoteInterface) => {
    setNotes((currentNotes: NoteInterface[]) =>
      currentNotes.map((note) => (note._id === newNote._id ? newNote : note))
    );
  };

  useEffect(() => {
    initSocket();

    socket.on(SocketMessageToClient.GetAllNotes, setNotes);
    socket.on(SocketMessageToClient.CreateNote, (data) => {
      setNotes((currentNotes) => [...currentNotes, data]);
    });
    socket.on(SocketMessageToClient.DeleteNote, (data) => {
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== data._id)
      );
    });
    socket.on(SocketMessageToClient.UpdateNote, (data) => changeNotes(data));

    return () => {
      disconnectSocket();
    };
  }, []);

  return { notes, changeNotes };
};
