import axios from "axios";
import { FC, useState } from "react";
import Modal from "react-modal";
import { UserInterface } from "../../interfaces/UserInterface";
import { fetchCreateUser } from "../../utils/api";
import { setToLocalStorage } from "../../utils/localstorage";
import classes from "./popup.module.css";

interface PopupProps {
  isModalOpen: boolean;
  changeIsModalOpen: (isModalOpen: boolean) => void;
  changeUser: (user: UserInterface | null) => void;
}

const Popup: FC<PopupProps> = ({
  isModalOpen,
  changeIsModalOpen,
  changeUser,
}) => {
  const [error, setError] = useState("");

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      username: { value: string };
    };

    const username = target.username.value;

    if (!username) {
      return;
    }

    try {
      const data = await fetchCreateUser(username);
      changeUser(data);
      changeIsModalOpen(false);
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
    changeIsModalOpen(false);
    setError("");
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      className={classes.modal}
      overlayClassName={classes.overlay}
    >
      <div className={classes.title}>Sign In</div>
      <div className={classes.form}>
        <form onSubmit={(event) => onSubmit(event)}>
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
