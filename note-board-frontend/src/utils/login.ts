import { fetchCreateUser, fetchGetUser } from "./api";
import { UserInterface } from "../interfaces/UserInterface";
import axios from "axios";

const LOCAL_STORAGE: string = process.env.REACT_APP_LOCAL!;

export const getUserFromLocalStorage = async (
  setUser: (data: UserInterface | null) => void,
  setInit: (init: boolean) => void
) => {
  const currentValue = localStorage.getItem(LOCAL_STORAGE);

  if (currentValue) {
    try {
      const data = await fetchGetUser(currentValue);
      setUser(data);
      setInit(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      } else {
        console.log(error);
      }
    }
  }
};

export const login = async (
  changeUser: (data: UserInterface | null) => void,
  changeIsModalOpen: (isModalOpen: boolean) => void,
  setError: (error: string) => void
) => {
  const { username } = document.forms[0];

  if (!username.value) {
    return;
  }

  try {
    const data = await fetchCreateUser(username.value);
    changeUser(data);
    changeIsModalOpen(false);
    localStorage.setItem(LOCAL_STORAGE, username.value);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      setError(error.response?.data.message);
    } else {
      console.log(error);
    }
  }
};

export const logout = (setUser: (data: UserInterface | null) => void) => {
  localStorage.removeItem(LOCAL_STORAGE);
  setUser(null);
};
