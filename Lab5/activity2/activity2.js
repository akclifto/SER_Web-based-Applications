/* eslint-disable no-unused-vars */
const URL = "https://api.github.com/users/";

/**
 * Method to get username detail from GitHub API
 */
function getDetails() {
  resetTable();
  const username = document.getElementById("username").value;
  if (username === "" || username === undefined) {
    let error = "Please enter a valid username";
    document.getElementById("issues").innerHTML = "<b>" + error + "</b>";
  } else {
    fetch(URL.concat(`${username}/repos`))
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setData(data);
        return true;
      })
      .catch((error) => {
        console.log("getDetail error: ", error);
      });
  }
}

/**
 * Function to refresh the table. It will re-fetch the api and
 * populate the table from GitHub API.
 */
function refresh() {
  getDetails();
}

/**
 * Function to reset the table/clear previous queries.
 */
function resetTable() {
  let rowCount = document.getElementById("table").getElementsByTagName("tr")
    .length;
  let table = document.getElementById("table");
  //skip the first row since its the headers
  for (let i = 1; i < rowCount; i++) {
    table.rows[i].innerHTML = "";
  }
  document.getElementById("issues").innerHTML = "";
  document.getElementById("selection").innerHTML = "";
  //   console.log("Table reset");
}

function getBranches() {
  console.log("getBranches clicked");
}

/**
 * Method to set the data to the table
 * @param {*} data : json data object from Github API
 */
function setData(data) {
  let issues = {};
  let totalOpenIssues = 0;
  for (let item in data) {
    issues[data[item].name] = data[item].open_issues_count;
    totalOpenIssues += data[item].open_issues_count;
    if (item < 2) {
      let lang_url = data[item].languages_url;
      let html_url = data[item].html_url;
      let api_url = data[item].downloads_url;
      let addRow = document.getElementById("table").insertRow();
      let row =
        "<td>" +
        data[item].name +
        "</td>" +
        "<td> Created at:\n" +
        data[item].created_at +
        "<br/><br/>" +
        "\n Updated at:\n " +
        data[item].updated_at +
        "</td>" +
        "<td>" +
        data[item].size +
        "</td>" +
        "<td>" +
        data[item].forks_count +
        "</td>" +
        "<td>" +
        data[item].open_issues_count +
        "</td>" +
        '<td><a href="' +
        html_url +
        '">' +
        data[item].html_url +
        "</a></td>" +
        "<td>" +
        data[item].language +
        "<br/><br/>" +
        'Language URL:\n <a href="' +
        lang_url +
        '">' +
        data[item].languages_url +
        "</a></td>" +
        '<td><a href="' +
        api_url +
        '">' +
        data[item].downloads_url +
        "</a></td>" +
        '<td> <button id="branches" onClick=getBranches()><label for="branches">Branches</label></button></td>';
      addRow.innerHTML = row;
    }
  }
}
