import { fetchCreateUser, fetchGetUser } from "./api";

export const getUserFromLocalStorage = async (setUser) => {
  const currentValue = localStorage.getItem(process.env.REACT_APP_LOCAL);

  if (currentValue) {
    try {
      const data = await fetchGetUser(currentValue);
      setUser(data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
};

export const login = async (event, changeUser, changeIsModalOpen, setError) => {
  event.preventDefault();
  const { username } = document.forms[0];

  if (!username.value) {
    return;
  }

  try {
    const data = await fetchCreateUser(username.value);
    changeUser(data);
    changeIsModalOpen(false);
    localStorage.setItem(process.env.REACT_APP_LOCAL, username.value);
  } catch (error) {
    setError(error.response.data.message);
    alert(error.response.data.message);
  }
};

export const logout = (setUser) => {
  localStorage.removeItem(process.env.REACT_APP_LOCAL);
  setUser(null);
};
