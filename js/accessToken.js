const { default: axios } = require("axios");

le  t accessToken = "";
  let loggedIn = false;
le  t userId = "";
  
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
    re  turn loggedIn;
  };
  
  const getAccessToken = () => {
     re turn accessToken;
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
    co  nsole.log(data);
    if   (data.ok) {
        const { accessToken: token } = data;
        accessToken = token;
    }
  };
    
mo  dule.exports = {
      setLoggedIn,
    getLoggedIn,
  setAccessToken,
  getAccessToken,
    refreshAccessToken,
  setUserId,
  getUserId,
};
                                                                                                                                                                                                                                                                                                                                                                