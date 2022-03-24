import { FC } from "react";
import { deleteNote } from "../../../utils/socket";
import classes from "./close.module.css";

interface CloseProps {
  textColor: string;
  _id: string;
}

const Close: FC<CloseProps> = ({ textColor, _id }) => {
  return (
    <button
      style={{
        color: textColor,
      }}
      className={classes.note_delete}
      onClick={() => deleteNote(_id)}
    >
      <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
        />
      </svg>
    </button>
  );
};

export default Close;
