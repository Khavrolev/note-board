import classNames from "classnames";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { idealTextColor } from "../../utils/getColor";
import Draggable from "react-draggable";
import classes from "./note.module.css";
import { SocketContext } from "../../contexts/SocketProvider";
import { changePosition, changeText } from "../../utils/socket";
import Close from "./close/close";

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
      handle={`.${classes.header}`}
      cancel={`.${classes.note_delete}`}
    >
      <div
        style={{
          backgroundColor: currentNote?.color,
          color: textColor,
        }}
        className={classNames(classes.note, {
          [classes.note_selected]: changeable,
        })}
      >
        <div
          className={classNames(classes.header, {
            [classes.header_selected]: changeable,
          })}
        >
          <div className={classes.username}>{currentNote?.user.name}</div>
          {changeable ? (
            <Close textColor={textColor} _id={currentNote._id} />
          ) : null}
        </div>
        <div className={classes.text}>
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
