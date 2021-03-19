const api = require("./js/apicalls");
const {
  setAccessToken,
  getAccessToken,
  refreshAccessToken,
  setLoggedIn,
  getLoggedIn,
  getUserId,
  setUserId,
} = require("./js/accessToken");

const {
  showData,
  showButtons,
  showMap,
  showSideBar,
  showMessage,
} = require("./js/show");

async function load() {
  await refreshAccessToken();
}

async function application() {
  await load();
  showButtons();

  if (getLoggedIn()) {
    document.querySelector("#signupForm").textContent = "";
    document.querySelector("#loginArea").textContent = "";
    populateSideBar();
  }

  async function populateSideBar() {
    let allData = await api.getSavedTrackingData(getUserId(), getAccessToken());
    document.querySelector("#savedTracking").innerHTML = showSideBar(allData);
    let trackingCodes = document.querySelectorAll(".trackingCode");
    trackingCodes.forEach((element) => {
      element.addEventListener("click", handleTrackingNumber);
    });
  }

  if (!getLoggedIn()) {
    document
      .querySelector("#signupForm")
      .addEventListener("submit", (event) => {
        handleSignup(event);
      });

    document.querySelector("#loginForm").addEventListener("submit", (event) => {
      handleLogin(event);
    });
  }

  document
    .querySelector("#trackingNumberForm")
    .addEventListener("submit", (event) => {
      handleTrackingNumber(event);
    });
}

application();
