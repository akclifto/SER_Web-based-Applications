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
    try {
      fetch(URL.concat(`${username}/repos`), {
        method: "GET",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          setData(data);
          return true;
        })
        .catch((error) => {
          console.log(error.status);
          console.log("getDetail error: ", error);
        });
    } catch (err) {
      console.log(err);
    }
  }
}

function handleResponse(response, username) {
  if (response.status === 404) {
    document.getElementById(
      "issues"
    ).innerHTML = `\nCould not find ${username} on GitHub`;
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
  //skip the first row since it's the headers
  if (rowCount > 1) {
    for (let i = 0; i < rowCount - 1; i++) {
      document.getElementById("table").deleteRow(1);
    }
    document.getElementById("issues").innerHTML = "";
    document.getElementById("selection").innerHTML = "";
    console.log("Table reset");
  }
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
  let repoSize = 0;
  for (let item in data) {
    issues[data[item].name] = data[item].open_issues_count;
    totalOpenIssues += data[item].open_issues_count;
    repoSize += 1;
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
  displayIssues(issues, totalOpenIssues, repoSize);
}

/**
 * Function to display the issues text above table.
 * @param {*} issues : issues object
 * @param {*} totalOpenIssues : total number of issues.
 */
function displayIssues(issues, totalOpenIssues, repoSize) {
  let average = totalOpenIssues / repoSize;
  let max = Object.keys(issues)[0];
  let maxCount = Object.values(issues)[0];

  let index = 0;
  for (let i in issues) {
    // console.log(i);
    if (Object.values(issues)[index] > maxCount) {
      maxCount = Object.values(issues)[index];
      max = i;
    }
    index += 1;
    // console.log("For loop key: ", Object.keys(issues)[index]);
    // console.log("For loop value: ", Object.values(issues)[index]);
  }
  average = average.toFixed(4);
  //   console.log("avg: ", average);
  //   console.log("max: ", max);
  let text = `The average issues count is ${average} and the repository with the maximum issues count is ${max}`;
  document.getElementById("issues").innerHTML = text;
}
