import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { createNewNote } from "../../utils/socket";
import Note from "../note/note";
import classes from "./board.module.css";

const Board = ({ user }) => {
  const socket = useContext(SocketContext);
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    socket.on("all-notes-to-client", setNotes);
    socket.on("create-note-to-client", (data) => {
      setNotes((currentNotes) => [...currentNotes, data]);
    });
    socket.on("delete-note-to-client", (data) => {
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== data._id)
      );
    });

    return () => socket.disconnect();
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
