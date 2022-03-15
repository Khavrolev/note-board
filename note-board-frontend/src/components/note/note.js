import classNames from "classnames";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { idealTextColor } from "../../utils/getColor";
import Draggable from "react-draggable";
import cl from "./note.module.css";
import { SocketContext } from "../../contexts/SocketProvider";
import { changePosition, changeText, deleteNote } from "../../utils/socket";

const Note = ({ note, user }) => {
  const [textColor, setTextColor] = useState(null);
  const [currentNote, setCurrentNote] = useState(note);
  const socket = useContext(SocketContext);

  useEffect(() => {
    setTextColor(idealTextColor(currentNote?.color));

    socket.on("update-note-to-client", (data) => {
      if (note._id === data._id) {
        setCurrentNote(data);
      }
    });
  }, []);

  const changeable = useMemo(
    () => isChangeable(user.name, note.user.name),
    [user.name, note.user.name]
  );

  return (
    <Draggable
      onStart={() => changeable}
      onStop={(event, data) => changePosition(socket, data, currentNote)}
      handle={`.${cl.header}`}
      cancel={`.${cl.note_delete}`}
    >
      <div
        style={{
          top: currentNote?.top,
          left: currentNote?.left,
          backgroundColor: currentNote?.color,
          color: textColor,
        }}
        className={classNames(cl.note, {
          [cl.note_selected]: changeable,
        })}
      >
        <div className={cl.header}>
          <div className={cl.username}>{currentNote?.user.name}</div>
          {changeable ? (
            <button
              className={cl.note_delete}
              onClick={() => deleteNote(socket, currentNote._id)}
            >
              X
            </button>
          ) : null}
        </div>
        <div className={cl.text}>
          <textarea
            style={{
              color: textColor,
            }}
            value={currentNote?.text}
            readOnly={!changeable}
            onChange={(event) => changeText(socket, event, currentNote)}
          ></textarea>
        </div>
      </div>
    </Draggable>
  );
};

const isChangeable = (userName, notesUserName) => userName === notesUserName;

export default Note;
