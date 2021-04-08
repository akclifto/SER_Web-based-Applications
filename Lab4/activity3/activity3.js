/* eslint-disable no-unused-vars */
/**
 * Lab 4 Activity 3
 * @author Adam Clifton
 * @email (akclifto@asu.edu)
 *
 */

let critic = {
  movie: "The Room (2003)",
  review: [
    "I've never in my life been more entertained by a film that has absolutely NO redeeming qualities.  The sense of alienation emanating from this film places the audience extremely far from being able to relate to what's happening on screen which leaves a lot of room for uncontrollable laughter given the right circumstances. This really is a new frontier. It is truly awful, but I cannot recommend it enough. - IMDB",
    "That’s the trick to making a cult film. It can’t just be bad, it has to be memorably so, and “The Room” is. Fans shout at the screen, wait for the aged pug dog’s first appearance and throw spoons. - Movie Nation",
    "Steadily grows more outrageous in its awfulness, generating countless laugh-out-loud moments. - Rotten Tomatoes",
  ],
};

let dict = {
  dictionary_name: "default",
  entries: [
    {
      key: [
        "stupid",
        "dumb",
        "idiot",
        "unintelligent",
        "simple-minded",
        "braindead",
        "foolish",
        "unthoughtful",
      ],
      answer: ["educated", "informed", "schooled"],
    },
    {
      key: ["unattractive", "hideous", "ugly"],
      answer: [
        "attractive",
        "beauteous",
        "beautiful",
        "lovely",
        "pretty",
        "ravishing",
      ],
    },
    {
      key: [
        "ambiguous",
        "cryptic",
        "dark",
        "nebulous",
        "obscure",
        "unintelligible",
      ],
      answer: [
        "obvious",
        "plain",
        "unambiguous",
        "understandable",
        "unequivocal",
      ],
    },
    {
      key: [
        "incapable",
        "incompetent",
        "inept",
        "unable",
        "unfit",
        "unqualified",
        "weak",
        "artless",
      ],
      answer: ["accomplished", "fit", "adept", "complete", "consummate"],
    },
    {
      key: ["emotionless", "heartless", "unkind", "mean", "selfish", "evil"],
      answer: ["benevolent", "benignant", "gentle", "kind", "clement"],
    },
    {
      key: ["idle"],
      answer: [
        "Can you reply something?",
        "You have been idle for more than 30 seconds",
        "Whats the matter with you? Submit something",
      ],
    },
  ],
};

let holdUser = "";
let returningUser = false;
let userSubmitted = false;
let idleTimeout = true;
let idleMessage = getIdleMessages();

/**
 * Handle username input.
 * Activity 2 Req R1
 */
function handleUsername() {
  let username = document.getElementById("username").value.trim();
  if (username.length > 0 && username !== " ") {
    holdUser = username;
    setStateUsername(holdUser);
    // console.log(localStorage.getItem("username"));
    // document.cookie = "user=" + username + ";";
    setCookie(username);
    displayGreeting(username);
    if (userSubmitted === false) {
      setReviewContent();
      handleIdleTimeout();
    }
    userSubmitted = true;
  } else {
    console.log("No valid username input");
    alert("Please enter a username to submit");
  }
}

/**
 * Cookies don't work.
 * Activity 2 Req R1
 * @param {*} username : username to save in session
 */
function setCookie(username) {
  //   let d = new Date();
  document.cookie = "user=" + username + ";expires=0;path=/";
  document.cookie = "visited=" + true + ";";
}

/**
 * Cookies don't work.
 * Activity 2 Req R1
 * @param {*} cname : name of cookie to get
 */
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

/**
 * Greet returning user.
 * Activity 2 Req R1
 * Activity 3 Req R1
 * @param {*} username : name of returning user.
 */
window.onload = () => {
  let user = getCookie("user");
  let persistUser = localStorage.getItem("username");
  let userComments = localStorage.getItem("userComments");

  if (persistUser !== null && persistUser !== undefined) {
    holdUser = persistUser;
    returningUser = true;
    displayGreeting(persistUser);
    setReviewContent();
  } else {
    if (user !== "" && user !== " " && user !== undefined) {
      returningUser = true;
      displayGreeting(user);
      setReviewContent();
      handleIdleTimeout();
    }
  }
  if (userComments !== null && persistUser !== undefined) {
    document.getElementById("user-comments").innerHTML = userComments;
  }
};

/**
 * Diplay greeting.
 * Activity 2 Req R1
 * @param {*} username : name of user
 */
function displayGreeting(username) {
  let greeting = "";
  // TODO cookies don't work,
  //if return "Welcome back <username>! Please enter your comments about the movie."
  if (returningUser) {
    greeting = `Welcome back ${username}! Please enter your comments about the movie.`;
  } else {
    greeting = `Hello ${username}.  Welcome to movie review System!  Please enter your comments about the movie.`;
  }
  document.getElementById("welcome").innerHTML = greeting;
}

/**
 * Set movie critic review content.
 * Activity 2 Req R2
 */
function setReviewContent() {
  document.getElementById("review-movie").innerHTML = critic.movie;
  critic.review.forEach((item, index) => {
    document.getElementById("review-body").innerHTML += "<li>" + item;
  });
}

/**
 * Handles user comments functionality, checks comments, parses, censors bad words.
 * Activity 2 Req R2
 */
function handleUserComments() {
  setIdleTimeout(false);
  if (holdUser === "") {
    alert("Please enter your username before commenting.");
    setIdleTimeout(true);
    return;
  }
  let comments = document.getElementById("user-comments").value.trim();
  if (comments.includes("/clear")) {
    resetState();
  } else if (comments.includes("/search")) {
    console.log("search has been selected");

  } else if (comments.includes("/history")) {
    console.log("history has been selected");

  } else if (comments.includes("/count")) {
    console.log("count has been selected");

  } else {
    let parsed = parseComments(comments);
    // console.log(parsed[0]);
    if (parsed[0] === undefined) {
      alert(
        "Cannot submit comments.\nPlease add a comment or remove any empty lines before the start of your comment."
      );
      setIdleTimeout(true);
      return;
    }
    //check json
    let jsonFlag = jsonValidator(parsed);
    if (jsonFlag) {
      console.log("Processing json input...");
      processJsonInput(parsed);
    } else {
      parsed = censorship(parsed);
      document.getElementById("user-comments").value = parsed;
    }
    saveSessionState(parsed);
  }
}

/**
 * Activity 2 Req R2. se regex expressions to parse comments.
 * @param {*} userComments : The user comments to parse
 * @returns parsed comments;
 */
function parseComments(userComments) {
  // regex: replace any char that is not a word or space char with empty space, /[^\w\s]/ , " "
  // regex: replace up to multiple new lines with empty space, global match /\n+/g , " "
  let clean = userComments.replace(/\n+/g, " ");
  console.log("Cleaning up comments...");
  // trim whatever is left
  clean.trim();
  let comments = clean.split(" ");
  let parsedComments = {};

  for (let c in comments) {
    if (comments[c] === "" || comments[c] === " ") {
      console.log("Skipping empty space...");
    } else {
      parsedComments[c] = comments[c];
    }
  }
  // console.log(parsedComments);
  return parsedComments;
}

/**
 * Activity 2 Req R2 and R3.  Potato censhorship algorithm.
 * @param {*} parsed : comments to check against bad words dict and replace.
 */
function censorship(parsed) {
  let censored = [];
  let checkGoods = [];
  let goodWord = "";

  for (let p in parsed) {
    for (let i in dict.entries) {
      for (let d in dict.entries[i].key) {
        if (parsed[p].toLowerCase().includes(dict.entries[i].key[d])) {
          let goodIdx = replaceWord(i);
          if (checkGoods.length === 0) {
            checkGoods.push(goodIdx);
            goodWord = dict.entries[i].answer[goodIdx];
          } else {
            if (checkGoods.length === 1) {
              while (goodIdx === checkGoods[checkGoods.length - 1]) {
                goodIdx = replaceWord(i);
              }
              checkGoods.push(goodIdx);
            } else {
              while (
                goodIdx === checkGoods[checkGoods.length - 1] ||
                goodIdx === checkGoods[checkGoods.length - 2]
              ) {
                goodIdx = replaceWord(i);
              }
              checkGoods.push(goodIdx);
            }
            goodWord = dict.entries[i].answer[goodIdx];
          }
          console.log(
            parsed[p] + " is a bad word and will be replaced with " + goodWord
          );
          parsed[p] = goodWord;
        }
      }
    }
  }
  censored = reconstructComment(parsed);
  console.log("This comment has been posted as the following:\n", censored);
  return censored;
}

/**
 * Activity 2 Req R2.  Method to put parsed user comment back together as a string.
 * @param {*} parsed : object to reconstruct
 * @returns string of reconstructed comment.
 */
function reconstructComment(parsed) {
  let str = "";
  for (let i in parsed) {
    str += parsed[i].concat(" ");
  }
  return str;
}

/**
 * Activity 2 Req R3. Replace bad word with random word at correct entry index.
 * @param {*} entryIndex : dict.entries index
 * @returns random good word replacement.
 */
function replaceWord(entryIndex) {
  return Math.floor(Math.random() * dict.entries[entryIndex].answer.length);
}

function getGoodDict(entryIndex) {
  return dict.entries[entryIndex].answer;
}

/**
 * Activity 2 Req R4, idle timer. Handle the timeout function.
 */
function handleIdleTimeout() {
  // console.log(idleTimeout);
  // re: Req R4 description, setTimeout() implements a one-shot timer,
  // setInterval continues the alerts until the user is no longer idle.
  // therefore, using setInterval and not setTimeout.
  window.setInterval(() => {
    if (idleTimeout === true) {
      // console.log("timer going off");
      if (idleMessage.length === 0) {
        idleMessage = getIdleMessages();
      }
      let message = idleMessage.pop();
      alert(message);
    }
  }, 30000);
}

/**
 * Activity 2 Req R4. Get idle messages from dict.
 * @returns array of idle messages from dict
 */
function getIdleMessages() {
  return dict.entries[dict.entries.length - 1].answer.slice(0);
}

/**
 * Activity 2 Req R4. Set the idleTimeout flag.
 * @param {*} flag : boolean value for idleTimeout.
 */
function setIdleTimeout(flag) {
  // console.log("setting to " + flag);
  idleTimeout = flag;
}

/**
 * Activity 2 Req R4. Handle key press in comment textarea to turn off idle timeout.
 */
function keyPressIdleTime() {
  if (idleTimeout === true) {
    setIdleTimeout(false);
  }
}

/**
 * Activity 2 Req R5. Json Validator to check Json input.
 * @param {*} parsed : user comments to validate.
 */
function jsonValidator(parsed) {
  parsed = reconstructComment(parsed);
  let first = parsed.substring(0, 1);
  let last = parsed.charAt(parsed.length - 1);
  if (last === " ") {
    last = parsed.charAt(parsed.length - 2);
  }
  if (first === "{" && last === "}") {
    console.log("Checking for Json input...");
    // console.log("first: ", first);
    // console.log("last: ", last);
    return true;
  }
  return false;
}

/**
 * Activity 2 Req R5. Method to process Json Input after validation check.
 * @param {*} parsed : json input to process
 */
function processJsonInput(parsed) {
  parsed = reconstructComment(parsed);
  try {
    let jsonObj = JSON.parse(parsed);
    // console.log(Object.keys(jsonObj));
    let k = Object.keys(jsonObj)[0];
    let flag = checkJsonKeys(jsonObj);
    if (flag) {
      alert("Word added to the dictionary and the dictionary is smarter.");
    } else {
      alert("Could not find the proper key and the dictionary stays dumb.");
    }
  } catch (err) {
    console.log("Json error: ", err);
    alert("Invalid JSON! Please enter a valid JSON!");
  }
}

/**
 * Activity 2 Req R5. Method to check input keys against dict keys.
 * @param {*} jsonObj : json object to check.
 * @return {boolean} true if found key and added to dictionary. False otherwise.
 */
function checkJsonKeys(jsonObj) {
  let jsonObjKey = Object.keys(jsonObj)[0];
  for (let i in dict.entries) {
    for (let j in dict.entries[i].key) {
      // console.log(dict.entries[i].key[j]);
      if (jsonObjKey === dict.entries[i].key[j]) {
        console.log("there is a match");
        addToDictionary(i, jsonObj);
        return true;
      }
    }
  }
}

/**
 * Activity 2 Req R5.  Method to add json entry to dictionary.
 * @param {*} dictIndex : index in dict.entries
 * @param {*} jsonObj : jsonObj to add new entry.
 */
function addToDictionary(dictIndex, jsonObj) {
  // console.log(Object.values(jsonObj)[0]);
  // console.log(dict.entries[dictIndex]);
  dict.entries[dictIndex].answer.push(Object.values(jsonObj)[0]);
}

/**
 * Activity 3 Req R1.  Save username in local storage.
 * @param {*} username : username to store
 */
function setStateUsername(username) {
  localStorage.setItem("username", username);
}

/**
 * Activity 3 Req R1.  Save user comments in local storage.
 * @param {*} username : username to store
 */
function saveSessionState(parsed) {
  localStorage.setItem("userComments", parsed);
}

/**
 * Activity 3 Req R2.  Save user comments in local storage.
 * @param {*} username : username to store
 */
function resetState() {
  console.log("Applicaion has been cleared and reset.");
  localStorage.clear();
  document.getElementById("username").innerHTML = "";
  document.getElementById("welcome").innerHTML = "";
  document.getElementById("review-movie").innerHTML = "";
  document.getElementById("review-body").innerHTML = "";
  document.getElementById("user-comments").innerHTML = "";
}
