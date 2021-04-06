/**
 * Lab 4 Activity 2
 * @author Adam Clifton
 * @email (akclifto@asu.edu)
 *
 */

function getUsername() {
  let username = document.getElementById("username").value.trim();
  if (username.length > 0 && username !== " ") {
    setCookie(username);
    // let cookie = getCookie("user");
    // console.log(cookie);
    displayGreeting(username);
    setReviewContent();
  } else {
    console.log("No valid username input");
  }
}

function setCookie(username) {
  //   let d = new Date();
  document.cookie = "user=" + username + ";expires=0;path=/";
  document.cookie = "visited=" + true + ";";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function displayGreeting(username) {
  // TODO cookies don't work,
  //if return "Welcome back <username>! Please enter your comments about the movie."
  let greeting = `Hello ${username}. Welcome to movie review System! Please enter your comments about the movie.`;
  document.getElementById("welcome").innerHTML = greeting;
}

function setReviewContent() {

}
