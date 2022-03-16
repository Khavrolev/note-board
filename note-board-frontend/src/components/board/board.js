import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { createNewNote } from "../../utils/socket";
import Note from "../note/note";
import cl from "./board.module.css";

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
  }, []);

  return (
    <div
      onDoubleClick={(event) => createNewNote(socket, event, user)}
      className={cl.board}
    >
      {user &&
        notes?.map((note, index) => (
          <Note key={note._id} note={note} user={user} />
        ))}
    </div>
  );
};

export default Board;
