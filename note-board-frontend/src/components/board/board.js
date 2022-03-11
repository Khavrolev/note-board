import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import Note from "../note/note";
import cl from "./board.module.css";

const Board = () => {
  const socket = useContext(SocketContext);
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    socket.on("all-notes-to-client", setNotes);

    return () => socket.disconnect();
  }, []);

  return (
    <div className={cl.board}>
      {notes?.map((note, index) => (
        <Note key={index} note={note} />
      ))}
    </div>
  );
};

export default Board;
