import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserProvider";
import { NoteInterface } from "../interfaces/NoteInterface";
import { getRandomColor } from "../utils/getColor";
import {
  createNoteOnServer,
  disconnectSocket,
  initSocket,
  onCreateNoteFromServer,
  onDeleteNoteFromServer,
  onGetAllNotesFromServer,
  onUpdateNoteFromServer,
  updateNoteOnServer,
} from "../utils/socket";

export const useNotes = () => {
  const [notes, setNotes] = useState<NoteInterface[]>([]);
  const [isDragging, setIsDragging] = useState(false); //prevent creation new Note, when Note is dragging
  const user = useContext(UserContext);

  const handleChangeNote = (newNote: NoteInterface) => {
    setNotes((currentNotes: NoteInterface[]) =>
      currentNotes.map((note) => (note._id === newNote._id ? newNote : note))
    );
  };

  const handleChangeAndUpdateNote = (newNote: NoteInterface) => {
    handleChangeNote(newNote);
    updateNoteOnServer(newNote);
  };

  const handleIsDragging = (value: boolean) => {
    setIsDragging(value);
  };

  const handleCreateNewNote = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!user || event.target !== event.currentTarget || isDragging) {
      return;
    }
    createNoteOnServer({
      text: "",
      userId: user?._id,
      color: getRandomColor(),
      top: event.nativeEvent.offsetY,
      left: event.nativeEvent.offsetX,
    });
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

  return {
    notes,
    handleChangeNote: handleChangeAndUpdateNote,
    handleCreateNewNote,
    handleIsDragging,
  };
};
