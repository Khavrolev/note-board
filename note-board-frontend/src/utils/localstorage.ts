const LOCAL_STORAGE: string = process.env.REACT_APP_LOCAL!;

export const getFromLocalStorage = () => {
  return localStorage.getItem(LOCAL_STORAGE);
};

export const setToLocalStorage = (value: string) => {
  localStorage.setItem(LOCAL_STORAGE, value);
};

export const removeFromLocalStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE);
};
