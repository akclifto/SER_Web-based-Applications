/* eslint-disable no-unused-vars */
/**
 * Lab 4 Activity 2
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
  "dictionary_name": "default",
  "entries":
      [{
          "key": ["stupid", "dumb", "idiot", "unintelligent", "simple-minded", "braindead", "foolish", "unthoughtful"],
          "answer": ["educated", "informed", "schooled"]
      }, {
          "key": ["unattractive", "hideous", "ugly"],
          "answer": ["attractive", "beauteous", "beautiful", "lovely", "pretty", "ravishing"]
      }, {
          "key": ["ambiguous", "cryptic", "dark", "nebulous", "obscure", "unintelligible"],
          "answer": ["obvious", "plain", "unambiguous", "understandable", "unequivocal"]
      }, {
          "key": ["incapable", "incompetent", "inept", "unable", "unfit", "unqualified", "weak", "artless"],
          "answer": ["accomplished", "fit", "adept", "complete", "consummate"]
      }, {
          "key": ["emotionless", "heartless", "unkind", "mean", "selfish", "evil"],
          "answer": ["benevolent", "benignant", "gentle", "kind", "clement"]
      }, {
          "key": ["idle"],
          "answer": ["Can you reply something?", "You have been idle for more than 30 seconds", "Whats the matter with you? Submit something"]
      }]
}

let holdUser = "";
let userSubmitted = false;
let idleTimeout = true;
let idleMessage = getIdleMessages();

/**
 * Handle username input. Req R1
 */
function handleUsername() {
  let username = document.getElementById("username").value.trim();
  if (username.length > 0 && username !== " ") {
    holdUser = username;
    document.cookie = "user=" + username + ";";
    setCookie(username);
    // cookies don't work
    // let cookie = getCookie("user");
    // console.log(cookie);
    displayGreeting(username);
    if (userSubmitted === false) {
      setReviewContent();
      handleIdleTimeout();
    }
    userSubmitted = true;
  } else {
    console.log("No valid username input");
  }
}

/**
 * Cookies don't work.  Req R1
 * @param {*} username : username to save in session
 */
function setCookie(username) {
  //   let d = new Date();
  document.cookie = "user=" + username + ";expires=0;path=/";
  document.cookie = "visited=" + true + ";";
}

/**
 * Cookies don't work.  Req R1
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
 * Diplay greeting. Req R1
 * @param {*} username : name of user
 */
function displayGreeting(username) {
  // TODO cookies don't work,
  //if return "Welcome back <username>! Please enter your comments about the movie."
  let greeting = `Hello ${username}.  Welcome to movie review System!  Please enter your comments about the movie.`;
  document.getElementById("welcome").innerHTML = greeting;
}

/**
 * Set movie critic review content. Req R2
 */
function setReviewContent() {
  document.getElementById("review-movie").innerHTML = critic.movie;
  critic.review.forEach((item, index) => {
    document.getElementById("review-body").innerHTML += "<li>" + item;
  });
}

/**
 * Handles user comments functionality, checks comments, parses, censors bad words.
 * Req R2
 */
function handleUserComments() {
  setIdleTimeout(false);
  if (holdUser === "") {
    alert("Please enter your username before commenting.");
    setIdleTimeout(true);
    return;
  }
  let comments = document.getElementById("user-comments").value;
  let parsed = parseComments(comments);
  console.log(parsed);
  if (parsed[0] === undefined) {
    alert("No comments to submit. Please try again.");
    setIdleTimeout(true);
    return;
  } else {
    parsed = censorship(parsed);
  }
  console.log(parsed);
}

/**
 * Use regex expressions to parse comments. Req R2
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
 * Potato censhorship algorithm. Req R2 and R3
 * @param {*} parsed : comments to check against bad words dict and replace.
 */
function censorship(parsed) {
  let censored = [];
  let checkGoods = [];
  let goodWord = "";

  for (let p in parsed) {
    for (let i in dict.entries) {
      for (let d in dict.entries[i].key) {
        if (parsed[p].includes(dict.entries[i].key[d])) {
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
  console.log("This comment has been censored to the following: ", censored);
  return censored;
}

/**
 * Method to put parsed user comment back together as a string. Req R2
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
 * Replace bad word with random word at correct entry index. Req R3
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
 * Req R4, idle timer. Handle the timeout function.
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
 * Get idle messages from dict. Req R4
 * @returns array of idle messages from dict
 */
function getIdleMessages() {
  return dict.entries[dict.entries.length - 1].answer.slice(0);
}

/**
 * set the idleTimeout flag. Req R4
 * @param {*} flag : boolean value for idleTimeout.
 */
function setIdleTimeout(flag) {
  // console.log("setting to " + flag);
  idleTimeout = flag;
}

/**
 * Handle key press in comment textarea to turn off idle timeout. Req R4
 */
function keyPressIdleTime() {
  if (idleTimeout === true) {
    setIdleTimeout(false);
  }
}
