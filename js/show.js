const {
  handleDelete,
  handleSave,
  handleTrackingNumber,
} = require("./handlershandle");
const { getAccessToken, getUserId } = require("./accessToken");
const api = require("./apicalls");
let cleared = true;

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
                            <p3>- ${obj.message} </p3>
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

async function showMap(tracker) {
  let {
    city,
    state,
  } = tracker.data.tracking_details.reverse()[0].tracking_location;
  const data = await api.getGeoData(city, state);
  let { lng, lat } = data.results[0].geometry.location;
  initMap(lng, lat);
}

function showSideBar(data) {
  let sideBarData = ``;
  if (data.ok) {
    data.trackingNumbers.forEach((element) => {
      sideBarData += `<div class='row'><div class='col-sm-6 col-md-6 col-lg-4 col-xl-auto'> 
      <p1 class='trackingCode' data-tracking='{"carrier": "${element.carrier}", "trackingNumber": "${element.number}"}'>
      Tracking Number: ${element.number}</p1> </div></div>`;
    });
  }
  return sideBarData;
}

async function showMap(tracker) {
  let {
    city,
    state,
  } = tracker.data.tracking_details.reverse()[0].tracking_location;
  const data = await api.getGeoData(city, state);
  let { lng, lat } = data.results[0].geometry.location;
  initMap(lng, lat);
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

function showMessage(message) {
  return `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          <div>${message}</div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
          `;
}

function consoleButtonsJS() {
  return `
      <button class="btn btn-primary" type="button" id="clear">Clear</button>
      <button class="btn btn-primary" type="button" id="save"">Save</button>
      <button class="btn btn-danger" type="button" id="remove">Remove</button>
    `;
}

function clearDivs() {
  document.querySelector("#trackingData").textContent = "";
  document.querySelector("#trackingNumber").value = "";
  document.querySelector("#map").textContent = "";
  cleared = true;
  showButtons();
}

async function populateSideBar() {
  let allData = await api.getSavedTrackingData(getUserId(), getAccessToken());
  document.querySelector("#savedTracking").innerHTML = showSideBar(allData);
  let trackingCodes = document.querySelectorAll(".trackingCode");
  trackingCodes.forEach((element) => {
    element.addEventListener("click", (event) => handleTrackingNumber(event));
  });
}

module.exports = {
  showData,
  showButtons,
  showMap,
  showSideBar,
  showMessage,
  populateSideBar,
};
