import Board from "./components/board/board";
import "./App.css";
import { FC, useCallback, useEffect, useState } from "react";
import Popup from "./components/popup/popup";
import { UserInterface } from "./interfaces/UserInterface";
import { fetchGetUser } from "./utils/api";
import axios from "axios";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from "./utils/localstorage";
import { UserContext } from "./contexts/UserProvider";

const App: FC = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getUserFromLocalStorage();
  }, []);

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

  return (
    <UserContext.Provider value={user}>
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
        <Board />
      </div>
    </UserContext.Provider>
  );
};

export default App;
