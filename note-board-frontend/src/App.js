import Board from "./components/board/board";
import Modal from "react-modal";
import { socket, SocketContext } from "./contexts/SocketProvider";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { getUserFromLocalStorage, logout } from "./utils/login";
import Popup from "./components/popup/popup";

Modal.setAppElement("#root");
function App() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getUserFromLocalStorage(setUser);
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
              : `Hello, friend! Please, sign in`}
          </div>
          <button
            className="header_button"
            onClick={() => (user ? logout(setUser) : setIsModalOpen(true))}
          >
            {user ? "Sign Out" : "Sign In"}
          </button>
        </div>
        <Board user={user} />
      </div>
    </SocketContext.Provider>
  );
}

export default App;
