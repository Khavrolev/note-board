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
  }, [currentNote, note, socket]);

  const changeable = useMemo(
    () => isChangeable(user.name, note.user.name),
    [user.name, note.user.name]
  );

  return (
    <Draggable
      onStart={() => changeable}
      onStop={(event, data) =>
        changePosition(socket, data, currentNote, setCurrentNote)
      }
      position={{ x: currentNote.left, y: currentNote.top }}
      handle={`.${cl.header}`}
      cancel={`.${cl.note_delete}`}
    >
      <div
        style={{
          backgroundColor: currentNote?.color,
          color: textColor,
        }}
        className={classNames(cl.note, {
          [cl.note_selected]: changeable,
        })}
      >
        <div
          className={classNames(cl.header, {
            [cl.header_selected]: changeable,
          })}
        >
          <div className={cl.username}>{currentNote?.user.name}</div>
          {changeable ? (
            <button
              style={{
                color: textColor,
              }}
              className={cl.note_delete}
              onClick={() => deleteNote(socket, currentNote._id)}
            >
              <svg
                style={{ width: "24px", height: "24px" }}
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                />
              </svg>
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
            onChange={(event) =>
              changeText(socket, event, currentNote, setCurrentNote)
            }
          ></textarea>
        </div>
      </div>
    </Draggable>
  );
};

const isChangeable = (userName, notesUserName) => userName === notesUserName;

export default Note;
