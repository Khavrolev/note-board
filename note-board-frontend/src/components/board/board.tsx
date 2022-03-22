import React, { FC, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { NoteInterface } from "../../interfaces/NoteInterface";
import { UserInterface } from "../../interfaces/UserInterface";
import { createNewNote, SocketMessageToClient } from "../../utils/socket";
import Note from "../note/note";
import classes from "./board.module.css";

interface Props {
  user: UserInterface | null;
}

const Board: FC<Props> = ({ user }) => {
  const socket = useContext(SocketContext);
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

  return (
    <div
      onClick={(event) => {
        if (user) {
          createNewNote(socket, event, user);
        }
      }}
      className={classes.board}
    >
      {user &&
        notes?.map((note) => <Note key={note._id} note={note} user={user} />)}
    </div>
  );
};

export default Board;
