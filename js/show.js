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

module.exports = { showData };
