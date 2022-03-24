import classNames from "classnames";
import { FC, useContext, useState } from "react";
import { idealTextColor } from "../../utils/getColor";
import Draggable, { DraggableData } from "react-draggable";
import classes from "./note.module.css";
import Close from "./close/close";
import { NoteInterface } from "../../interfaces/NoteInterface";
import { UserContext } from "../../contexts/UserProvider";

interface NoteProps {
  note: NoteInterface;
  changePosition: (note: NoteInterface, data: DraggableData) => void;
  changeText: (
    note: NoteInterface,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

const Note: FC<NoteProps> = ({ note, changeText, changePosition }) => {
  const [textColor] = useState(idealTextColor(note?.color));
  const user = useContext(UserContext);

  const changeable = isChangeable(user?.name, note.user.name);

  return (
    <Draggable
      onStart={() => {
        if (!changeable) {
          return false;
        }
      }}
      onStop={(event, data) => changePosition(note, data)}
      position={{ x: note.left, y: note.top }}
      handle={`.${classes.header}`}
      cancel={`.${classes.note_delete}`}
    >
      <div
        style={{
          backgroundColor: note?.color,
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
          <div className={classes.username}>{note?.user.name}</div>
          {changeable ? <Close textColor={textColor} _id={note._id} /> : null}
        </div>
        <div className={classes.text}>
          <textarea
            style={{
              color: textColor,
            }}
            value={note?.text}
            readOnly={!changeable}
            onChange={(event) => changeText(note, event)}
          ></textarea>
        </div>
      </div>
    </Draggable>
  );
};

const isChangeable = (userName: string | undefined, notesUserName: string) =>
  userName === notesUserName;

export default Note;
