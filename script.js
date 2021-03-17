const api = require("./js/apicalls");
const { setAccessToken, getAccessToken } = require("./js/accessToken");

function initMap() {
  // The location of Uluru
  const uluru = {
    lat: -25.344,
    lng: 131.036,
  };
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
}

function myClearFunction() {
  document.getElementById("myForm").reset();
}

function mySaveFunction() {
  document.getElementById("myForm").save();
}

document.querySelector("#signupForm").addEventListener("submit", (event) => {
  handleSignup(event);
});

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
document.querySelector("#loginForm").addEventListener("submit", (event) => {
  handleLogin(event);
});

async function handleLogin(event) {
  event.preventDefault();
  let { email, password } = event.target;
  const data = await api.login(email.value, password.value);
  if (!data.ok) {
    document.getElementById("signupMessage").innerHTML = "Invalid ";
  } else {
    let { accessToken } = data;
    setAccessToken(accessToken);
  }
}
