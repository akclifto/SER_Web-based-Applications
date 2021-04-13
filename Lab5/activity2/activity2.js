/**
 * Method to get username detail from GitHub API
 */
function getDetails() {
  document.getElementById("issues").innerHTML = "";
  const username = document.getElementById("username").value;
  if (username === "" || username === undefined) {
    let error = "Please enter a valid username";
    document.getElementById("issues").innerHTML = "<b>" + error + "</b>";
  }
}

function refresh() {
  console.log("refresh clicked");
}
