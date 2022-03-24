import classNames from "classnames";
import { FC, useContext, useEffect, useState } from "react";
import { idealTextColor } from "../../utils/getColor";
import Draggable, { DraggableData } from "react-draggable";
import classes from "./note.module.css";
import { SocketContext } from "../../contexts/SocketProvider";
import { SocketMessageToClient, updateNote } from "../../utils/socket";
import Close from "./close/close";
import { NoteInterface } from "../../interfaces/NoteInterface";
import { UserContext } from "../../contexts/UserProvider";

interface NoteProps {
  note: NoteInterface;
}

const Note: FC<NoteProps> = ({ note }) => {
  const [textColor, setTextColor] = useState("");
  const [currentNote, setCurrentNote] = useState(note);
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);

  useEffect(() => {
    const updateInfoFromSocket = (data: any) => {
      if (note._id === data._id) {
        setCurrentNote(data);
      }
    };

    setTextColor(idealTextColor(currentNote?.color));

    socket.on(SocketMessageToClient.UpdateNote, updateInfoFromSocket);

    return () => {
      socket.off(SocketMessageToClient.UpdateNote, updateInfoFromSocket);
    };
  }, [currentNote, note, socket]);

  const changeable = isChangeable(user?.name, note.user.name);

  const changeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = { ...currentNote, text: event.target.value };
    updateNote(socket, newNote);
    setCurrentNote(newNote);
  };

  const changePosition = (data: DraggableData) => {
    const newNote = {
      ...currentNote,
      top: data.y,
      left: data.x,
    };
    updateNote(socket, newNote);
    setCurrentNote(newNote);
  };

  return (
    <Draggable
      onStart={() => {
        if (!changeable) {
          return false;
        }
      }}
      onStop={(event, data) => changePosition(data)}
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
            onChange={(event) => changeText(event)}
          ></textarea>
        </div>
      </div>
    </Draggable>
  );
};

const isChangeable = (userName: string | undefined, notesUserName: string) =>
  userName === notesUserName;

export default Note;
