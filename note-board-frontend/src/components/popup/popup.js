import { useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import { login } from "../../utils/login";
import cl from "./popup.module.css";

const Popup = ({ isModalOpen, changeIsModalOpen, changeUser }) => {
  const [error, setError] = useState("");

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => {
        changeIsModalOpen(false);
        setError("");
      }}
      className={cl.modal}
      overlayClassName={cl.overlay}
    >
      <div className={cl.title}>Sign In</div>
      <div className={cl.form}>
        <form
          onSubmit={(event) =>
            login(event, changeUser, changeIsModalOpen, setError)
          }
        >
          <div className={cl.input_container}>
            <label>Username </label>
            <input type="text" name="username" required />
            <div
              style={{
                visibility: error ? "visible" : "hidden",
              }}
              className={cl.error}
            >
              {error}
            </div>
          </div>
          <div className={cl.button_container}>
            <input type="submit" />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Popup;
