import axios from "axios";
import { useEffect, useState } from "react";

const PREFIX = "note-board-";

export default function useGetUser(key) {
  const prefixedKey = PREFIX + key;
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchData = async (userName) => {
      try {
        //в таком случае, если в базе не было пользователя, то будет ошибка, и она будет в логах клиента. Это нормальная практика?
        //или сервер просто при отсутствии такого пользователя должен возвращать пустоту, а валидация на стороне клиента?
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/users/${userName}`
        );

        setUser(response.data);
      } catch (e) {
        //почему я не вижу то сообщение об ошибке, которое у меня на сервере генерится?
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/users/`,
          { name: userName }
        );

        setUser(response.data);
      }
    };

    const currentValue = localStorage.getItem(prefixedKey);

    if (currentValue !== null) {
      fetchData(currentValue);
      return;
    }

    const newValue = prompt("Enter your name");

    if (newValue === null) {
      return;
    }

    localStorage.setItem(prefixedKey, newValue);

    fetchData(newValue);
  }, []);

  return [user, setUser];
}
