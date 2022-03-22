import { FC, useState } from "react";
import Modal from "react-modal";
import { UserInterface } from "../../interfaces/UserInterface";
import { login } from "../../utils/login";
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

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => {
        changeIsModalOpen(false);
        setError("");
      }}
      className={classes.modal}
      overlayClassName={classes.overlay}
    >
      <div className={classes.title}>Sign In</div>
      <div className={classes.form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            login(changeUser, changeIsModalOpen, setError);
          }}
        >
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
