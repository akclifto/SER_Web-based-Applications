/* eslint-disable no-unused-vars */
/**
 * Lab 5 Activity 1
 * @author Adam Clifton
 * @email akclifto@asu.edu
 */

function checkInput() {
  let input = document.getElementById("currency-usd").value;
  let conv = "";
  try {
    conv = parseFloat(input).toFixed(2);
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
 * Method to convert USD to EURO
 */
function convertEuro() {
  console.log("convert euro clicked");
}

/**
 * Method to convert USD to GBP
 */
function convertGBP() {
  console.log("convert GBP clicked");
}

/**
 * Method to pop last action from history.
 */
function pop() {
  console.log("pop clicked");
}

/**
 * Method to reset history activity.
 */
function reset() {
  console.log("reset clicked");
}

/**
 * Method to display user activity.
 */
function showHistory() {
  console.log("show history clicked");
}
