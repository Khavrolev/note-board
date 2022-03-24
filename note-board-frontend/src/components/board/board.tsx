import { FC, useContext } from "react";
import { UserContext } from "../../contexts/UserProvider";
import { useNotes } from "../../hooks/useNotes";
import { getRandomColor } from "../../utils/getColor";
import { createNoteOnServer } from "../../utils/socket";
import Note from "../note/note";
import classes from "./board.module.css";

const Board: FC = () => {
  const user = useContext(UserContext);
  const { notes, handleChangeNote } = useNotes();

  const handleCreateNewNote = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!user || event.target !== event.currentTarget) {
      return;
    }
    createNoteOnServer({
      text: "",
      userName: user?.name,
      color: getRandomColor(),
      top: event.nativeEvent.offsetY,
      left: event.nativeEvent.offsetX,
    });
  };

  return (
    <div onDoubleClick={handleCreateNewNote} className={classes.board}>
      {user &&
        notes?.map((note) => (
          <Note
            key={note._id}
            note={note}
            handleChangeNote={handleChangeNote}
          />
        ))}
    </div>
  );
};

export default Board;
