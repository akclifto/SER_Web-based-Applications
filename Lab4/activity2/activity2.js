/**
 * Lab 4 Activity 2
 * @author Adam Clifton
 * @email (akclifto@asu.edu)
 *
 */

function handleUsername() {
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
  let greeting = `Hello ${username}.  Welcome to movie review System!  Please enter your comments about the movie.`;
  document.getElementById("welcome").innerHTML = greeting;
}

function setReviewContent() {
  document.getElementById("review-movie").innerHTML = critic.movie;
  critic.review.forEach(mapReviews);
}

function mapReviews(item, index) {
  document.getElementById("review-body").innerHTML += "<li>" + item;
}

function handleUserComments() {
  let comments = document.getElementById("user-comments").value;
  //TODO parse comments
  console.log(comments);
}

function parseComments(comments) {
    
}

// dictionary
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

let critic = {
  movie: "The Room (2003)",
  review: [
    "I've never in my life been more entertained by a film that has absolutely NO redeeming qualities.  The sense of alienation emanating from this film places the audience extremely far from being able to relate to what's happening on screen which leaves a lot of room for uncontrollable laughter given the right circumstances. The camera work and production techniques would not be out of place in many daytime soap operas, nor would the script and plot, but there is an undefinable quality which separates this movie from the sense mediocrity often found in such shows and instead casts it deep into the abyss of tragically bad film making where it will be forever trapped along with Wiseau's artistic integrity. This really is a new frontier. It is truly awful, but I cannot recommend it enough. - IMDB",
    "That’s the trick to making a cult film. It can’t just be bad, it has to be memorably so, and “The Room” is. Fans shout at the screen, wait for the aged pug dog’s first appearance and throw spoons. - Movie Nation",
    "Steadily grows more outrageous in its awfulness, generating countless laugh-out-loud moments. - Rotten Tomatoes",
  ],
};
