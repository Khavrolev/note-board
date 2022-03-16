import { useEffect, useState } from "react";
import { fetchGetData, fetchPostData } from "../utils/api";

const PREFIX = "note-board-";

export default function useGetUser(key) {
  const prefixedKey = PREFIX + key;
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const currentValue = localStorage.getItem(prefixedKey);

      if (currentValue !== null) {
        try {
          const data = await fetchGetData(currentValue);
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
        const data = await fetchPostData(newValue);
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
