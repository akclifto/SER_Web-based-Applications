/* eslint-disable prettier/prettier */
const URL = "http://localhost:8008";
const req = new XMLHttpRequest();

window.onload = () => {
  showAPI();
};

function showAPI() {
  let api = "";
  req.open("GET", URL.concat("/api_s"), true);
  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      if (req.status == 200) {
        // console.log(req.responseText);
        let resp = JSON.parse(req.responseText);
        api = resp.api;
        if (api.length === 0 || api === "") {
          document.getElementById("api-body").innerHTML =
            "<li> No API Documentation Found";
        } else {
          document.getElementById("api-head").innerHTML = api.api_name;
          document.getElementById("api-sub").innerHTML = api.subTitle;
          api.calls.forEach((item) => {
            document.getElementById("api-body").innerHTML +=
              "<b><h3> " + item.type + ": \t\t" + item.extension + "</b></h3>" + 
              "<b> Description: </b>" + item.description + "<br/>" + 
              "<b> Headers: </b>" + item.headers + "<br/>" + 
              "<b> Request: </b>" + item.request + "<br/>" + 
              "<b> Response: </b>" + item.response + "<br/><br/>";
          });
        }
      }
    }
  };
  req.send();
}
