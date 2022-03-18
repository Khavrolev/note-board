import { useEffect, useState } from "react";
import { fetchGetUser, fetchCreateUser } from "../utils/api";

const PREFIX = "note-board-";

export default function useGetUser(key) {
  const prefixedKey = PREFIX + key;
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const currentValue = localStorage.getItem(prefixedKey);

      if (currentValue !== null) {
        try {
          const data = await fetchGetUser(currentValue);
          setUser(data);
        } catch (error) {
          alert(error.response.data.message);
        }
        return;
      }

      const newValue = prompt("Enter your name");

      if (newValue === null) {
        return;
      }

      try {
        const data = await fetchCreateUser(newValue);
        setUser(data);
        localStorage.setItem(prefixedKey, newValue);
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    fetchData();
  }, []);

  return [user, setUser];
}
