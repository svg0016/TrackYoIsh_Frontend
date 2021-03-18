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

let cleared = true;
showButtons();

// refreshAccessToken();

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
  console.log(data);
  if (!data.ok) {
    console.log(data.message);
    document.getElementById("ishMessenger").innerHTML = "Invalid";
  } else {
    let { accessToken } = data;
    setAccessToken(accessToken);
    setLoggedIn(true);
    setUserId(data.userId);
    document.getElementById("ishMessenger").innerHTML = "Success!";
    let allData = await api.getSavedTrackingData(getUserId(), getAccessToken());
    document.querySelector("#savedTracking").innerHTML = showSideBar(allData);
    document.querySelector("#signupForm").textContent = "";
    document.querySelector("#loginArea").textContent = "";
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
  let { carrier, trackingNumber } = event.target;
  const data = await api.getTrackingData(
    trackingNumber.value,
    carrier.value,
    getAccessToken()
  );
  if (data.ok) {
    document.querySelector("#map").innerHTML = showMap(data);
    document.querySelector("#trackingData").innerHTML = showData(data);
    cleared = false;
    showButtons();
  } else {
    console.log(carrier.value);
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
        <p id="tracking_code">${tracking_code}</p>
        <p2 id="carrier">${carrier}</p2>
    `;
  tracking_details.forEach((obj) => {
    dataToShow += `<div class="container">
                        <div class="row">
                          <div class="col-auto">  
                            <p3>Message: ${obj.message}</p3>
                            <p4>Status: ${obj.status}</p4>    
                            <p5>Location: ${
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
                            <p5>
                            <p6>${obj.datetime}<p6>
                            
                            
                          </div>
                        </div>  
                      </div> `;
  });

  // {
  //             "object": "TrackingDetail",
  //             "message": "Departed from Facility",
  //             "description": "Departed from Facility",
  //             "status": "in_transit",
  //             "status_detail": "departed_facility",
  //             "datetime": "2021-03-16T08:09:00Z",
  //             "source": "UPS",
  //             "carrier_code": "I",
  //             "tracking_location": {
  //                 "object": "TrackingLocation",
  //                 "city": "Hodgkins",
  //                 "state": "IL",
  //                 "country": "US",
  //                 "zip": null
  //             }
  //         }

  return dataToShow;
}

function showSideBar(data) {
  let sideBarData = ``;
  if (data.ok) {
    data.trackingNumbers.forEach((element) => {
      sideBarData += `<p1>Tracking Number: ${element.number}</p1>`;
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
