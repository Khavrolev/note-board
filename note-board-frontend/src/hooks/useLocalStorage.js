import { useEffect, useState } from "react";

const PREFIX = "note-board-";

export default function useLocalStorage(key) {
  const prefixedKey = PREFIX + key;
  const [value, setValue] = useState("");

  useEffect(() => {
    const currentValue = localStorage.getItem(prefixedKey);

    if (currentValue !== null) {
      setValue(currentValue);
      return;
    }

    const newValue = prompt("Enter your name");

    if (newValue === null) {
      return;
    }

    localStorage.setItem(prefixedKey, newValue);

    setValue(newValue);
  }, []);

  return [value, setValue];
}
