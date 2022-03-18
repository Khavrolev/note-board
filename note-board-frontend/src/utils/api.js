import axios from "axios";

const host = `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`;

export const fetchGetUser = async (userName) => {
  const response = await axios.get(`${host}/users/${userName}`);
  return response.data;
};

export const fetchCreateUser = async (userName) => {
  const response = await axios.post(`${host}/users/`, { name: userName });
  return response.data;
};
