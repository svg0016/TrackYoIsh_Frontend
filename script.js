const api = require("./js/apicalls");
const { refreshAccessToken, getLoggedIn } = require("./js/accessToken");

const { showButtons, populateSideBar } = require("./js/show");

const {
  handleLogin,
  handleSignup,
  handleTrackingNumber,
} = require("./js/handlershandle");

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
