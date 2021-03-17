const axios = require("axios").default;

const login = async (email, password) => {
  const promise = await axios.post("https://trackyoish.herokuapp.com/login", {
    email,
    password,
  });
  if (promise.data.ok) {
    localStorage.setItem("userID", promise.data.userId);
  }
  return promise.data;
};

const signup = async (firstname, lastname, email, password) => {
  const promise = await axios.post("https://trackyoish.herokuapp.com/signup", {
    firstname,
    lastname,
    email,
    password,
  });
  return promise.data;
};

const getTrackingData = async (trackingNumber, carrier, token) => {
  const promise = await axios.get(
    `https://trackyoish.herokuapp.com/trackingnumber/${trackingNumber}/${carrier}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return promise.data;
};

const getSavedTrackingData = async (userId, token) => {
  const promise = await axios.get(`http://localhost:5000/getall/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return promise.data;
};

const saveTrackingData = async (userId, trackingNumber, carrier, token) => {
  const promise = await axios.put(
    "https://trackyoish.herokuapp.com/trackingNumber",
    {
      userId,
      trackingNumber,
      carrier,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return promise.data;
};

const deleteTrackingData = async (userId, trackingNumber, carrier, token) => {
  const promise = await axios.delete(
    "https://trackyoish.herokuapp.com/trackingNumber",
    {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        userId,
        trackingNumber,
        carrier,
      },
    }
  );
  return promise.data;
};
module.exports = {
  login,
  signup,
  getTrackingData,
  getSavedTrackingData,
  saveTrackingData,
  deleteTrackingData,
};

// const showData = async () => {
//   console.log(
//     await deleteTrackingData(
//       "92055901755477000326971082",
//       "dreber",
//       "USPS",
//       "ddd"
//     )
//   );
// };

// showData();
