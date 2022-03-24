import { FC, useCallback, useContext } from "react";
import { DraggableData } from "react-draggable";
import { UserContext } from "../../contexts/UserProvider";
import { useNotes } from "../../hooks/useNotes";
import { NoteInterface } from "../../interfaces/NoteInterface";
import { getRandomColor } from "../../utils/getColor";
import { createNote, updateNote } from "../../utils/socket";
import Note from "../note/note";
import classes from "./board.module.css";

const Board: FC = () => {
  const user = useContext(UserContext);
  const { notes, changeLocalNotes } = useNotes();

  const changeText = useCallback(
    (note: NoteInterface, event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newNote = { ...note, text: event.target.value };
      changeLocalNotes(newNote);
      updateNote(newNote);
    },
    [changeLocalNotes]
  );

  const changePosition = useCallback(
    (note: NoteInterface, data: DraggableData) => {
      const newNote = {
        ...note,
        top: data.y,
        left: data.x,
      };
      changeLocalNotes(newNote);
      updateNote(newNote);
    },
    [changeLocalNotes]
  );

  const onDoubleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (user) {
      if (event.target !== event.currentTarget) {
        return;
      }
      createNote({
        text: "",
        userName: user?.name,
        color: getRandomColor(),
        top: event.nativeEvent.offsetY,
        left: event.nativeEvent.offsetX,
      });
    }
  };

  return (
    <div onDoubleClick={onDoubleClick} className={classes.board}>
      {user &&
        notes?.map((note) => (
          <Note
            key={note._id}
            note={note}
            changeText={changeText}
            changePosition={changePosition}
          />
        ))}
    </div>
  );
};

export default Board;
