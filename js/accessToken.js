const { default: axios } = require("axios");

let accessToken = "";
let loggedIn = false;
let userId = "";
let loading = true;

const setAccessToken = (token) => {
  accessToken = token;
};

const setLoggedIn = (status) => {
  loggedIn = status;
};

const getLoading = () => {
  return loading;
};

const setUserId = (id) => {
  userId = id;
};

const setLoading = (status) => {
  loading = status;
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
  const userStoredId = localStorage.getItem("userId");
  const promise = await axios.post(
    "https://trackyoish.herokuapp.com/refresh-token",
    { userId: userStoredId },
    {
      withCredentials: true,
    }
  );
  const data = promise.data;
  if (data.ok) {
    const { accessToken: token, userId: id } = data;
    setAccessToken(token);
    setLoggedIn(true);
    setLoading(false);
    console.log(getLoggedIn());
    userId = id;
  } else {
    setLoggedIn(false);
    setLoading(false);
    userId = "";
    setAccessToken("");
  }
};

const preLoadCheck = async () => {
  await refreshAccessToken();
};

window.preLoadCheck = preLoadCheck;

module.exports = {
  setLoggedIn,
  getLoggedIn,
  setAccessToken,
  getAccessToken,
  refreshAccessToken,
  setUserId,
  getUserId,
  getLoading,
};
