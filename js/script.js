const api = require("./apicalls");
const { refreshAccessToken, getLoggedIn } = require("./accessToken");

const { showButtons, populateSideBar } = require("./show");

const {
  handleLogin,
  handleSignup,
  handleTrackingNumber,
} = require("./handlershandle");

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
