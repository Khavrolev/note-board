import Board from "./components/board/board";
import { socket, SocketContext } from "./contexts/SocketProvider";
import "./App.css";
import { FC, useCallback, useEffect, useState } from "react";
import { getUserFromLocalStorage, logout } from "./utils/login";
import Popup from "./components/popup/popup";
import { UserInterface } from "./interfaces/UserInterface";
import Modal from "react-modal";

Modal.setAppElement("#root");
const App: FC = () => {
  const [init, setInit] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getUserFromLocalStorage(setUser, setInit);
  }, []);

  const changeIsModalOpen = useCallback((value) => {
    setIsModalOpen(value);
  }, []);

  const changeUser = useCallback((value) => {
    setUser(value);
  }, []);

  return (
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
              : init
              ? `Hello, friend! Please, sign in`
              : ``}
          </div>
          {init ? (
            <button
              className="header_button"
              onClick={() => (user ? logout(setUser) : setIsModalOpen(true))}
            >
              {user ? "Sign Out" : "Sign In"}
            </button>
          ) : null}
        </div>
        <Board user={user} />
      </div>
    </SocketContext.Provider>
  );
};

export default App;
