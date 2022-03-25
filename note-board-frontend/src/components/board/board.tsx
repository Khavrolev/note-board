import { FC, useContext } from "react";
import { UserContext } from "../../contexts/UserProvider";
import { useNotes } from "../../hooks/useNotes";
import Note from "../note/note";
import classes from "./board.module.css";

const Board: FC = () => {
  const user = useContext(UserContext);
  const { notes, handleChangeNote, handleCreateNewNote, handleIsDragging } =
    useNotes();

  return (
    <div onClick={handleCreateNewNote} className={classes.board}>
      {user &&
        notes?.map((note) => (
          <Note
            key={note._id}
            note={note}
            onChangeNote={handleChangeNote}
            onIsDragging={handleIsDragging}
          />
        ))}
    </div>
  );
};

export default Board;
