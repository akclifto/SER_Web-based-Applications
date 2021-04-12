/* eslint-disable no-unused-vars */
/**
 * Lab 5 Activity 1
 * @author Adam Clifton
 * @email akclifto@asu.edu
 */
const URL = "http://localhost:8008";
const req = new XMLHttpRequest();
let history = [];

let input = document.getElementById("currency-usd");
input.addEventListener("keyup", checkInput);

/**
 * Method to validate user input.  Ensures it is numeric entry to access conversions.
 */
function checkInput() {
  let usd = document.getElementById("currency-usd").value;
  let conv = "";
  try {
    conv = parseFloat(usd).toFixed(2);
  } catch (err) {
    console.log(err.message);
  }
  if (conv !== "" && conv > 0) {
    document.getElementById("euro").removeAttribute("disabled");
    document.getElementById("pound").removeAttribute("disabled");
  } else {
    document.getElementById("euro").setAttribute("disabled", "disabled");
    document.getElementById("pound").setAttribute("disabled", "disabled");
  }
}
/**
 * Method to convert USD to EURO.
 */
function convertEuro() {
  let conversionType = "euro";
  requestConversion(conversionType);
}

/**
 * Method to convert USD to GBP
 */
function convertGBP() {
  let conversionType = "pound";
  requestConversion(conversionType);
}

/**
 * Method to pop last action from history.
 */
function pop() {
  req.open("GET", URL.concat("/pop"), true);
  req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      if (req.status == 200) {
        // console.log(req.responseText);
        let resp = JSON.parse(req.responseText);
        history = resp.history;
        if (history.length === 0 || history === "") {
          document.getElementById("history-list").innerHTML =
            "<li> No History Found.";
        } else {
          console.log(
            `The following was removed from history:\n ${resp.popped}`
          );
          document.getElementById("history-list").innerHTML = "";
          document.getElementById("reset").removeAttribute("disabled");
          history.forEach((item, index) => {
            document.getElementById("history-list").innerHTML +=
              "<li>" + (index + 1) + ": " + item + "<br>";
          });
        }
      }
    }
  };
  req.send();
}

/**
 * Method to reset history activity.
 */
function reset() {
  req.open("GET", URL.concat("/reset"), true);
  req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      if (req.status == 200) {
        // console.log(req.responseText);
        let resp = JSON.parse(req.responseText);
        history = resp.history;
        document.getElementById("reset").setAttribute("disabled", "disabled");
        document.getElementById("history-list").innerHTML = history;
      }
    }
  };
  req.send();
}

/**
 * Method to display user activity.
 */
function showHistory() {
  req.open("GET", URL.concat("/history"), true);
  req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      if (req.status == 200) {
        // console.log(req.responseText);
        let resp = JSON.parse(req.responseText);
        history = resp.history;
        if (history.length === 0 || history === "") {
          document.getElementById("history-list").innerHTML =
            "<li> No History Found.";
        } else {
          document.getElementById("history-list").innerHTML = "";
          document.getElementById("reset").removeAttribute("disabled");
          history.forEach((item, index) => {
            document.getElementById("history-list").innerHTML +=
              "<li>" + (index + 1) + ": " + item + "<br>";
          });
        }
      }
    }
  };
  req.send();
}

/**
 * Method to handle conversion request to server.  Since Euro and GBP conversion
 * requests are identical other than specifying conversion type, split to own function.
 * @param {*} conversionType : conversion type request (euro || pound)
 */
function requestConversion(conversionType) {
  let usd = document.getElementById("currency-usd").value;
  usd = parseFloat(usd).toFixed(2);
  const data = { usd };
  if (conversionType === "euro") {
    req.open("POST", URL.concat("/euro"), true);
  } else {
    req.open("POST", URL.concat("/pound"), true);
  }
  req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      if (req.status == 200) {
        // console.log(req.responseText);
        let resp = JSON.parse(req.responseText);
        history = resp.history;
        document.getElementById("currency-conversion").innerHTML =
          resp.converted;
        if (history.length > 0) {
          document.getElementById("reset").removeAttribute("disabled");
          document.getElementById("history-list").innerHTML = "";
          history.forEach((item, index) => {
            document.getElementById("history-list").innerHTML +=
              "<li>" + (index + 1) + ": " + item + "<br>";
          });
        }
      }
    }
  };
  req.send(JSON.stringify(data));
}
