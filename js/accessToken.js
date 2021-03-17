const { default: axios } = require("axios");

let accessToken = "";

const setAccessToken = (token) => {
  accessToken = token;
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

module.exports = { setAccessToken, getAccessToken, refreshAccessToken };
