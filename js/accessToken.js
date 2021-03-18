const { default: axios } = require("axios");

let accessToken = "";
let loggedIn = false;
let userId = "";

const setAccessToken = (token) => {
  accessToken = token;
};

const setLoggedIn = (status) => {
  loggedIn = status;
};

const setUserId = (id) => {
  userId = id;
};

const getUserId = () => {
  return userId;
};

const getLoggedIn = (status) => {
  return loggedIn;
};

const getAccessToken = () => {
  return accessToken;
};

const refreshAccessToken = async () => {
  const userId = localStorage.getItem("userId");
  const promise = await axios.post(
    "https://trackyoish.herokuapp.com/refresh-token",
    { userId },
    {
      withCredentials: true,
    }
  );
  const data = promise.data;
  console.log(data);
  if (data.ok) {
    const { accessToken: token } = data;
    accessToken = token;
  }
};

module.exports = {
  setLoggedIn,
  getLoggedIn,
  setAccessToken,
  getAccessToken,
  refreshAccessToken,
  setUserId,
  getUserId,
};
