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

let cleared = true;

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

  function clearDivs() {
    document.querySelector("#trackingData").textContent = "";
    document.querySelector("#trackingNumber").value = "";
    document.querySelector("#map").textContent = "";
    cleared = true;
    showButtons();
  }

  function consoleButtonsJS() {
    return `
      <button class="btn btn-primary" type="button" id="clear">Clear</button>
      <button class="btn btn-primary" type="button" id="save"">Save</button>
      <button class="btn btn-danger" type="button" id="remove">Remove</button>
    `;
  }
}

application();
