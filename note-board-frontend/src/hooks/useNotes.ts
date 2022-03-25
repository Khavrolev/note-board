import { useEffect, useState } from "react";
import { NoteInterface } from "../interfaces/NoteInterface";
import {
  disconnectSocket,
  initSocket,
  onCreateNoteFromServer,
  onDeleteNoteFromServer,
  onGetAllNotesFromServer,
  onUpdateNoteFromServer,
} from "../utils/socket";

export const useNotes = () => {
  const [notes, setNotes] = useState<NoteInterface[]>([]);

  const handleChangeNote = (newNote: NoteInterface) => {
    setNotes((currentNotes: NoteInterface[]) =>
      currentNotes.map((note) => (note._id === newNote._id ? newNote : note))
    );
  };

  useEffect(() => {
    initSocket();

    onGetAllNotesFromServer(setNotes);
    onCreateNoteFromServer((data) => {
      setNotes((currentNotes) => [...currentNotes, data]);
    });
    onDeleteNoteFromServer((data) => {
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== data._id)
      );
    });
    onUpdateNoteFromServer(handleChangeNote);

    return () => {
      disconnectSocket();
    };
  }, []);

  return { notes, handleChangeNote };
};
