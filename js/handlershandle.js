const {
  showData,
  showButtons,
  showMap,
  showMessage,
  populateSideBar,
} = require("./show");
const { getAccessToken, setAccessToken, setUserId } = require("./accessToken");
const api = require("./apicalls");
async function handleLogin(event) {
  event.preventDefault();
  let { email, password } = event.target;
  const data = await api.login(email.value, password.value);
  if (!data.ok) {
    document.getElementById("ishMessenger").innerHTML = showMessage(
      "Ivalid Login!"
    );
  } else {
    let { accessToken } = data;
    setAccessToken(accessToken);
    setLoggedIn(true);
    setUserId(data.userId);
    document.getElementById("ishMessenger").innerHTML = showMessage(
      "Login Successful!"
    );
    document.querySelector("#signupForm").textContent = "";
    document.querySelector("#loginArea").textContent = "";
    populateSideBar();
  }
}

async function handleDelete(event) {
  let userId = localStorage.getItem("userId");
  let trackingNumber = document.querySelector("#tracking_code").textContent;
  let data = await api.deleteTrackingData(
    userId,
    trackingNumber,
    getAccessToken()
  );

  if (data.ok) {
    document.getElementById("ishMessenger").innerHTML = showMessage(
      "Record Deleted!"
    );
    populateSideBar();
  } else {
    document.getElementById("ishMessenger").innerHTML = showMessage(
      "Record Not Deleted"
    );
  }
}

async function handleSave(event) {
  let userId = localStorage.getItem("userId");
  let trackingNumber = document.querySelector("#tracking_code").textContent;
  let carrier = document.querySelector("#carrier").textContent;
  let data = await api.saveTrackingData(
    userId,
    trackingNumber,
    carrier,
    getAccessToken()
  );
  if (data.ok) {
    document.getElementById("ishMessenger").innerHTML = showMessage(
      "Record Saved!"
    );
    populateSideBar();
  } else {
    document.getElementById("ishMessenger").innerHTML = showMessage(
      "Record Not Saved!"
    );
  }
}

async function handleTrackingNumber(event) {
  event.preventDefault();
  let carrier;
  let trackingNumber;
  if (event.target.getAttribute("data-tracking")) {
    const trackingData = JSON.parse(event.target.getAttribute("data-tracking"));
    carrier = trackingData.carrier;
    trackingNumber = trackingData.trackingNumber;
  } else {
    carrier = event.target.carrier.value;
    trackingNumber = event.target.trackingNumber.value;
  }
  const data = await api.getTrackingData(
    trackingNumber,
    carrier,
    getAccessToken()
  );
  if (data.ok) {
    document.querySelector("#map").innerHTML = showMap(data);
    document.querySelector("#trackingData").innerHTML = showData(data);
    cleared = false;
    showButtons();
    populateSideBar();
  } else {
    document.getElementById("ishMessenger").innerHTML = showMessage(
      "Invalid Tracking Data!"
    );
  }
}

async function handleSignup(event) {
  event.preventDefault();
  let { firstName, lastName, email, password } = event.target;
  const data = await api.signup(
    firstName.value,
    lastName.value,
    email.value,
    password.value
  );
  if (!data.ok) {
    document.querySelector("#emailSignupField").style.backgroundcolor = "red";
  } else {
    api.login(email.value, password.value);
  }
}

module.exports = {
  handleDelete,
  handleLogin,
  handleSave,
  handleSignup,
  handleTrackingNumber,
};
