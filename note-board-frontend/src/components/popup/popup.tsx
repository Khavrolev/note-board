import axios from "axios";
import { FC, useState } from "react";
import Modal from "react-modal";
import { UserInterface } from "../../interfaces/UserInterface";
import { fetchCreateUser, fetchGetUser } from "../../utils/api";
import { setToLocalStorage } from "../../utils/localstorage";
import classes from "./popup.module.css";

export enum SignPopup {
  Up = "Sign up",
  In = "Sign in",
}

interface PopupProps {
  isModalOpen: boolean;
  type: SignPopup;
  onIsModalOpenChange: (isModalOpen: boolean) => void;
  onUserChange: (user: UserInterface | null) => void;
}

const Popup: FC<PopupProps> = ({
  isModalOpen,
  type,
  onIsModalOpenChange,
  onUserChange,
}) => {
  const [error, setError] = useState("");

  const getFetchFunction = () => {
    if (type === SignPopup.Up) {
      return fetchCreateUser;
    } else if (type === SignPopup.In) {
      return fetchGetUser;
    }

    return () => {
      throw new Error("Wrong popup type");
    };
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = event.currentTarget.username.value;

    if (!username) {
      return;
    }

    try {
      const fetchFunction = getFetchFunction();

      const data = await fetchFunction(username);
      onUserChange(data);
      onIsModalOpenChange(false);
      setToLocalStorage(username);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      } else {
        console.log(error);
      }
    }
  };

  const onRequestClose = () => {
    onIsModalOpenChange(false);
    setError("");
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      className={classes.modal}
      overlayClassName={classes.overlay}
    >
      <div className={classes.title}>{[type]}</div>
      <div className={classes.form}>
        <form onSubmit={onSubmit}>
          <div className={classes.input_container}>
            <label>Username </label>
            <input
              className={classes.text}
              type="text"
              name="username"
              required
            />
            <div
              style={{
                visibility: error ? "visible" : "hidden",
              }}
              className={classes.error}
            >
              {error}
            </div>
          </div>
          <div className={classes.button_container}>
            <input className={classes.submit} type="submit" />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Popup;
