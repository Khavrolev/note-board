import { FC, useContext } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { UserContext } from "../../contexts/UserProvider";
import { NoteInterface } from "../../interfaces/NoteInterface";
import { getRandomColor } from "../../utils/getColor";
import { createNote } from "../../utils/socket";
import Note from "../note/note";
import classes from "./board.module.css";

interface NoteProps {
  notes: NoteInterface[];
}

const Board: FC<NoteProps> = ({ notes }) => {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);

  const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    createNote(socket, {
      text: "",
      userName: user?.name,
      color: getRandomColor(),
      top: event.nativeEvent.offsetY,
      left: event.nativeEvent.offsetX,
    });
  };

  return (
    <div onClick={(event) => onClick(event)} className={classes.board}>
      {user && notes?.map((note) => <Note key={note._id} note={note} />)}
    </div>
  );
};

export default Board;
