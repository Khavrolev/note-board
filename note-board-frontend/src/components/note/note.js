import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { getRandomColor, idealTextColor } from "../../utils/getColor";
import cl from "./note.module.css";

const Note = ({ note, user }) => {
  const [color, setColor] = useState(null);

  useEffect(() => {
    const newColor = {};

    newColor.backgroundColor = getRandomColor();
    newColor.fontColor = idealTextColor(newColor.backgroundColor);

    console.log(note);
    setColor(newColor);
  }, []);

  return (
    <div
      style={{
        top: note.top,
        left: note.left,
        backgroundColor: color?.backgroundColor,
        color: color?.fontColor,
      }}
      className={classNames(cl.note, {
        [cl.note_selected]: user.name === note.user.name,
      })}
    >
      <div className={cl.username}>{note?.user.name}</div>
      <div className={cl.text}>{note?.text}</div>
    </div>
  );
};

export default Note;
