import { FC, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { UserContext } from "../../contexts/UserProvider";
import { NoteInterface } from "../../interfaces/NoteInterface";
import { getRandomColor } from "../../utils/getColor";
import { createNote, SocketMessageToClient } from "../../utils/socket";
import Note from "../note/note";
import classes from "./board.module.css";

const Board: FC = () => {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  const [notes, setNotes] = useState<NoteInterface[]>([]);

  useEffect(() => {
    socket.on(SocketMessageToClient.GetAllNotes, setNotes);
    socket.on(SocketMessageToClient.CreateNote, (data) => {
      setNotes((currentNotes) => [...currentNotes, data]);
    });
    socket.on(SocketMessageToClient.DeleteNote, (data) => {
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== data._id)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (user) {
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
    }
  };

  return (
    <div onClick={(event) => onClick(event)} className={classes.board}>
      {user && notes?.map((note) => <Note key={note._id} note={note} />)}
    </div>
  );
};

export default Board;
