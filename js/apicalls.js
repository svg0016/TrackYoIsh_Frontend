const axios = require("axios").default;

const login = async (email, password) => {
  const promise = await axios.post(
    "https://trackyoish.herokuapp.com/login",
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );
  if (promise.data.ok) {
    localStorage.setItem("userId", promise.data.userId);
  }
  return promise.data;
};

const signup = async (firstname, lastname, email, password) => {
  const promise = await axios.post(
    "https://trackyoish.herokuapp.com/signup",
    {
      firstname,
      lastname,
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );
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
  const promise = await axios.get(
    `https://trackyoish.herokuapp.com/getall/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
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

const deleteTrackingData = async (userId, trackingNumber, token) => {
  const promise = await axios.delete(
    "https://trackyoish.herokuapp.com/trackingNumber",
    {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        userId,
        trackingNumber,
      },
    }
  );
  return promise.data;
};

const getGeoData = async (city, state) => {
  const promise = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}&key=AIzaSyCQbqhzxYkuL4h9T7xhg6pALDuREcVEMds`
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
  getGeoData,
};
