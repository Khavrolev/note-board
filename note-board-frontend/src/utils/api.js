import axios from "axios";

const host = `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`;

export const fetchGetData = async (userName) => {
  try {
    const response = await axios.get(`${host}/users/${userName}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPostData = async (userName, setUser) => {
  try {
    const response = await axios.post(`${host}/users/`, { name: userName });
    return response.data;
  } catch (error) {
    throw error;
  }
};
