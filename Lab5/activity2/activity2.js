/* eslint-disable no-unused-vars */
const URL = "https://api.github.com/users/";

/**
 * Method to get username detail from GitHub API.
 * Req R1
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
          console.log("getDetail error: ", error);
        });
    } catch (err) {
      console.log(err);
    }
  }
}

/**
 * Function to refresh the table. It will re-fetch the api and
 * populate the table from GitHub API.
 * Req R4
 */
function refresh() {
  getDetails();
}

/**
 * Function to reset the table/clear previous queries.
 * Req R4
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
    document.getElementById("branch-details").innerHTML = "";
    // console.log("Table reset");
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
      populateTable(data, item);
    }
  }
  displayIssues(issues, totalOpenIssues, repoSize);
  displaySelection(data, repoSize);
}

/**
 * Method to populate the table with GitHub user data.
 * Req R1
 * @param {*} data : json data object from Github API
 * @param {*} item : index item
 */
function populateTable(data, item) {
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

/**
 * Function to display the issues text above table.
 * Req R2
 * @param {*} issues : issues object
 * @param {*} totalOpenIssues : total number of issues.
 */
function displayIssues(issues, totalOpenIssues, repoSize) {
  let average = totalOpenIssues / repoSize;
  let max = Object.keys(issues)[0];
  let maxCount = Object.values(issues)[0];

  let index = 0;
  for (let i in issues) {
    if (Object.values(issues)[index] > maxCount) {
      maxCount = Object.values(issues)[index];
      max = i;
    }
    index += 1;
  }
  average = average.toFixed(4);
  let text = `The average issues count is ${average} and the repository with the maximum issues count is ${max}`;
  document.getElementById("issues").innerHTML = "<b>" + text + "</b>";
}

/**
 * Req R1, C and D
 * @param {*} data : data object from GitHub API.
 */
function displaySelection(data, repoSize) {
  let selection = document.getElementById("selection");
  let br = document.createElement("option");
  br.text = "";
  br.value = "";
  selection.options.add(br);
  let totalBranchDisplay = 7;
  if (repoSize < totalBranchDisplay) {
    totalBranchDisplay = repoSize;
  }
  if (totalBranchDisplay > 2) {
    for (let i = 2; i < totalBranchDisplay; i++) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
      let br = document.createElement("option");
      br.text = data[i].name;
      br.value = data[i].name;
      selection.options.add(br);
    }
  } else {
    document.getElementById("selection").innerHTML = "No Branches to Display";
  }

  selection.addEventListener("change", () => {
    let rowCount = document.getElementById("table").getElementsByTagName("tr")
      .length;
    // let branch = selection.options[selection.selectedIndex].value;
    // console.log(branch);
    // console.log(selection.selectedIndex);
    if (rowCount > 3) {
      document.getElementById("table").deleteRow(rowCount - 1);
      populateTable(data, selection.selectedIndex + 1);
    } else {
      populateTable(data, selection.selectedIndex + 1);
    }
  });
}
