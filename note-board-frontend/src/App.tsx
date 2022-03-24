import Board from "./components/board/board";
import { FC, useEffect, useState } from "react";
import Popup, { SignPopup } from "./components/popup/popup";
import { UserInterface } from "./interfaces/UserInterface";
import { fetchGetUser } from "./utils/api";
import axios from "axios";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from "./utils/localstorage";
import { UserContext } from "./contexts/UserProvider";
import classNames from "classnames";
import classes from "./App.module.css";

const App: FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [popupType, setPopupType] = useState<SignPopup>(SignPopup.In);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getUserFromLocalStorage();
  }, []);

  const signOut = () => {
    removeFromLocalStorage();
    setUser(null);
  };

  const signIn = () => {
    setIsModalOpen(true);
    setPopupType(SignPopup.In);
  };

  const signUp = () => {
    setIsModalOpen(true);
    setPopupType(SignPopup.Up);
  };

  const getUserFromLocalStorage = async () => {
    const currentValue = getFromLocalStorage();

    if (!currentValue) {
      setLoading(false);
      return;
    }

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
      setLoading(false);
    }
  };

  const getHeaderText = () => {
    if (user) {
      return `Hello, ${user.name}! We're happy to see you`;
    }

    if (loading) {
      return "loading...";
    }

    return "Hello friend! Please, sign in or sing up";
  };

  return (
    <UserContext.Provider value={user}>
      <div className={classes.container}>
        <Popup
          isModalOpen={isModalOpen}
          type={popupType}
          onIsModalOpenChange={setIsModalOpen}
          onUserChange={setUser}
        />
        <div className={classes.header}>
          <div className={classes.header_title}>{getHeaderText()}</div>
          {!loading && (
            <div>
              <button
                className={classNames(
                  classes.header_button,
                  classes.button_sign_in
                )}
                onClick={() => (user ? signOut() : signIn())}
              >
                {user ? "Sign Out" : "Sign In"}
              </button>
              {!user && (
                <button
                  className={classNames(
                    classes.header_button,
                    classes.button_sign_up
                  )}
                  onClick={signUp}
                >
                  Sign Up
                </button>
              )}
            </div>
          )}
        </div>
        <Board />
      </div>
    </UserContext.Provider>
  );
};

export default App;
