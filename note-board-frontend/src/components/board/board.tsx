import { FC, useCallback, useContext, useEffect, useState } from "react";
import { DraggableData } from "react-draggable";
import { UserContext } from "../../contexts/UserProvider";
import { NoteInterface } from "../../interfaces/NoteInterface";
import { getRandomColor } from "../../utils/getColor";
import {
  createNote,
  disconnectSocket,
  initSocket,
  socket,
  SocketMessageToClient,
  updateNote,
} from "../../utils/socket";
import Note from "../note/note";
import classes from "./board.module.css";

const Board: FC = () => {
  const user = useContext(UserContext);
  const [notes, setNotes] = useState<NoteInterface[]>([]);

  useEffect(() => {
    initSocket();

    socket.on(SocketMessageToClient.GetAllNotes, setNotes);
    socket.on(SocketMessageToClient.CreateNote, (data) => {
      setNotes((currentNotes) => [...currentNotes, data]);
    });
    socket.on(SocketMessageToClient.DeleteNote, (data) => {
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== data._id)
      );
    });
    socket.on(SocketMessageToClient.UpdateNote, (data) => {
      changeLocalNotes(data);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const changeLocalNotes = (newNote: NoteInterface) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) => (note._id === newNote._id ? newNote : note))
    );
  };

  const changeText = useCallback(
    (note: NoteInterface, event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newNote = { ...note, text: event.target.value };
      changeLocalNotes(newNote);
      updateNote(socket, newNote);
    },
    []
  );

  const changePosition = useCallback(
    (note: NoteInterface, data: DraggableData) => {
      const newNote = {
        ...note,
        top: data.y,
        left: data.x,
      };
      changeLocalNotes(newNote);
      updateNote(socket, newNote);
    },
    []
  );

  const onDoubleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (user) {
      if (event.target !== event.currentTarget) {
        return;
      }
      createNote(socket, {
        text: "",
        userName: user?.name,
        color: getRandomColor(),
        top: event.nativeEvent.offsetY,
        left: event.nativeEvent.offsetX,
      });
    }
  };

  return (
    <div
      onDoubleClick={(event) => onDoubleClick(event)}
      className={classes.board}
    >
      {user &&
        notes?.map((note) => (
          <Note
            key={note._id}
            note={note}
            changeText={changeText}
            changePosition={changePosition}
          />
        ))}
    </div>
  );
};

export default Board;
