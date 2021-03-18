const api = require("./js/apicalls");
const {
  setAccessToken,
  getAccessToken,
  refreshAccessToken,
  setLoggedIn,
  getLoggedIn,
  getUserId,
  setUserId,
  getLoading,
} = require("./js/accessToken");

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

  function initMap(lng, lat) {
    // The location of Uluru
    const uluru = { lat, lng };

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

  if (!getLoggedIn()) {
    document
      .querySelector("#signupForm")
      .addEventListener("submit", (event) => {
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
        document.querySelector("#emailSignupField").style.backgroundcolor =
          "red";
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
        document.getElementById("ishMessenger").innerHTML = "Invalid";
      } else {
        let { accessToken } = data;
        setAccessToken(accessToken);
        setLoggedIn(true);
        setUserId(data.userId);
        document.getElementById("ishMessenger").innerHTML = "Success!";
        document.querySelector("#signupForm").textContent = "";
        document.querySelector("#loginArea").textContent = "";
        populateSideBar();
      }
    }
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

  async function handleTrackingNumber(event) {
    event.preventDefault();
    let carrier;
    let trackingNumber;
    if (event.target.getAttribute("data-tracking")) {
      const trackingData = JSON.parse(
        event.target.getAttribute("data-tracking")
      );
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
      document.getElementById("ishMessenger").innerHTML = "Invalid";
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
      document.getElementById("ishMessenger").innerHTML = "Record Deleted";
      populateSideBar();
    } else {
      document.getElementById("ishMessenger").innerHTML = "Record Not Deleted";
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
      document.getElementById("ishMessenger").innerHTML = "Record Saved";
      populateSideBar();
    } else {
      document.getElementById("ishMessenger").innerHTML = "Record Not Saved";
    }
  }

  //take in easypost data and put data into map in html
  async function showMap(tracker) {
    let {
      country,
      city,
      state,
      zip,
    } = tracker.data.tracking_details.reverse()[0].tracking_location;
    const data = await api.getGeoData(city, state);
    let { lng, lat } = data.results[0].geometry.location;
    initMap(lng, lat);
  }

  function showData(data) {
    let { tracking_details, tracking_code, carrier } = data.data;
    let dataToShow = `
        <div>Tracking Number: <p id="tracking_code">${tracking_code}</p></div>
        <div>Carrier: <p2 id="carrier">${carrier}</p2></div>
    `;
    tracking_details.forEach((obj) => {
      dataToShow += `<div class="container">
                        <div class="row">
                          <div class="col-auto">  
                            <p3>${obj.message} </p3>
                            <p4>${obj.status} </p4>    
                            <p5>${
                              obj.tracking_location.city
                                ? obj.tracking_location.city
                                : "N/A"
                            }, 
                            ${
                              obj.tracking_location.state
                                ? obj.tracking_location.state
                                : ""
                            },
                            ${
                              obj.tracking_location.country
                                ? obj.tracking_location.country
                                : ""
                            }${
        obj.tracking_location.zip ? obj.tracking_location.zip : ""
      }
                            </p5>
                          </div>
                        </div>  
                      </div> `;
    });
    return dataToShow;
  }

  function showSideBar(data) {
    let sideBarData = ``;
    if (data.ok) {
      data.trackingNumbers.forEach((element) => {
        sideBarData += `<div class='row'> <p1 class='trackingCode' data-tracking='{"carrier": "${element.carrier}", "trackingNumber": "${element.number}"}'>Tracking Number: ${element.number}</p1> </div>`;
      });
    }
    return sideBarData;
  }

  function showButtons() {
    if (cleared) {
      document.querySelector("#consoleButtons").textContent = "";
    } else {
      document.querySelector("#consoleButtons").innerHTML = consoleButtonsJS();
      document.querySelector("#clear").addEventListener("click", clearDivs);
      document.querySelector("#remove").addEventListener("click", (event) => {
        handleDelete(event);
        clearDivs();
      });
      document.querySelector("#save").addEventListener("click", (event) => {
        handleSave(event);
      });
    }
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
