import Board from "./components/board/board";
import { SocketContext } from "./contexts/SocketProvider";
import "./App.css";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import Popup from "./components/popup/popup";
import { UserInterface } from "./interfaces/UserInterface";
import { fetchGetUser } from "./utils/api";
import axios from "axios";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from "./utils/localstorage";
import { UserContext } from "./contexts/UserProvider";
import { NoteInterface } from "./interfaces/NoteInterface";
import { SocketMessageToClient } from "./utils/socket";

const App: FC = () => {
  const socket = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState<NoteInterface[]>([]);

  useEffect(() => {
    const getUserFromLocalStorage = async () => {
      const currentValue = getFromLocalStorage();

      if (currentValue) {
        try {
          const data = await fetchGetUser(currentValue);
          setUser(data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log(error.response?.data.message);
          } else {
            console.log(error);
          }
        } finally {
          setLoading(true);
        }
      } else {
        setLoading(true);
      }
    };

    getUserFromLocalStorage();

    socket.on(SocketMessageToClient.GetAllNotes, setNotes);
    socket.on(SocketMessageToClient.CreateNote, (data) => {
      setNotes((currentNotes) => [...currentNotes, data]);
    });
    socket.on(SocketMessageToClient.DeleteNote, (data) => {
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== data._id)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const changeIsModalOpen = useCallback((value) => {
    setIsModalOpen(value);
  }, []);

  const changeUser = useCallback((value) => {
    setUser(value);
  }, []);

  const logout = () => {
    removeFromLocalStorage();
    setUser(null);
  };

  return (
    <UserContext.Provider value={user}>
      <SocketContext.Provider value={socket}>
        <div className="container">
          <Popup
            isModalOpen={isModalOpen}
            changeIsModalOpen={changeIsModalOpen}
            changeUser={changeUser}
          />
          <div className="header">
            <div className="header_title">
              {user
                ? `Hello, ${user.name}! We're happy to see you`
                : loading
                ? `Hello, friend! Please, sign in`
                : `loading...`}
            </div>
            {loading ? (
              <button
                className="header_button"
                onClick={() => (user ? logout() : setIsModalOpen(true))}
              >
                {user ? "Sign Out" : "Sign In"}
              </button>
            ) : null}
          </div>
          {user ? <Board notes={notes} /> : null}
        </div>
      </SocketContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
