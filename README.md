# SER-421 Web-based Applications

SER421: Web-based Applications Assignment Overview

## Contents

- [Lab 1](#Lab-1)
- [Lab 2](#Lab-2)
- [Lab 3](#Lab-3)
- [Lab 4](#Lab-4)

## Lab 1

- HTML Overview: HTML5 review, regex patterns and restrictions, and some JS for submission form checking.
  - The javascript used in the .html DOES NOT pertain to Part C (that specifies no JS). It is used to the submission handler and range indicator.
- Javascript Programming:
  - Part A calculator and comparison.  Script: (not using node_module export/import as specified in the lab)

    ```javascript
    node
    .load lab1act2partA.js
    .load lab1act2partA_test.js  
    ```

  - Part B calculator with nested JSON expressions. Script:

    ```javascript
    node
    .load lab1act2partB.js
    .load lab1act2partB_test.js  
    ```

  - Part C calculator with Prototype functions and nested JSON expressions push, pop and print. Script:

    ```javascript
    node
    .load lab1act2partC.js
    .load lab1act2partC_test.js  
    ```

### Note on export/import modules for testing

Node export/import available if that is how you are running your scripts.  Just uncomments the export statements at the bottom of each lab part. Example:

```javascript
// export default PreCalc;
```

And uncomment the import statement in the test file. Example:

```javascript
//  import PreCalc from "./lab1act2partC.js";
```

Using Node version 14.15.4 for this lab.  Please let me know if you have any questions.  Thank you.

[Back to Top](#Contents)

## Lab 2

### Activity 1: File I/O

This lab builds on concepts from Lab1. Scripts will be used from this point forward for these labs.  This Lab uses Node `version 14.15.4`.Check the `package.json` file for scripts. To run the test file for activity 1:  

`npm run act1`.

To instantiate object for own testing: `const varName = new FAQ(<path/to/jsonFile>);`

See test `FAQ00_test.js` to see general call structure.

### FAQ00 Class API Object Overview

#### QA:  Class to hold QA objects.  Not directly accessed in test file
  
- constructor:  question, answer, tags, author, date, id  (in that order)

#### FAQ: Class that handles all functionality of Activity 1

- constructor: jsonFile (<path/to/jsonFile> to load file that instantiates program)
  - jsonFile is top level called "QA.json" and should function running `npm run act1` command

#### FAQ Method Overview

- `loadQA(jsonFile)`:  auto-called in constructor.  Do not need to directly access.
- `writeQA(question, answer, tags, author, date)`:  manually write a new QA to store
  - If successfully written, will auto store to persistent file.
  - See `Testing R1:` in FAQ00_test.js for usage.
- `updateAnswer(id, answer)`: method to update answer given by id
  - requires to know id to change answer.  I'm presuming in the web app,    user will select QA block they want to update, and this method will be handled implicitly
  - See `Testing R2:` in FAQ00_test.js for usage.
- `updateTags(id, tags)`: method to update tags given by id
  - requires to know id.  See updateAnswer() method bullet-point
  - See `Testing R3:` in FAQ00_test.js for usage.
- `deleteQA(id)`: method to remove QA block from store.
  - requires to know id.  See updateAnswer() method bullet-point
  - See `Testing R4:` in FAQ00_test.js for usage.
- `filter(filterParams)`: Method to filter contect and return collection to user.
  - valid filters are author, dateRange, and tags. Format:
  `let someFilters = { author: <authorName>, dateRange: <dateRange>, tags:<tags> }`
  - Partial filter is optional, ex: `let someFilter = { author: "dr" }` will return collection with all authors start with "dr" substring. (which is everyone but Ruben)
  - See `Testing R5:` in FAQ00_test.js for usage.
- `genId()`: helper method that generates a random float id.  Do not need to directly access.
- `getId(id)`: helpter method to return index of id in store collection. Do not need to directly access.
- `storeToFile(dataStore)`: method that sync write to QA.json file.
  - See `Testing Write to JSON file:` in FAQ00_test.js for usage.
- `restoreBackupFile()`:  method that restore original QA.json file given in lab2
  - See `Testing Backup Restore of JSON file:` in FAQ00_test.js for usage.+

[Back to Top](#Contents)

### Activity 2: Implement a Simple FAQ Service

To start server, from top level, run:

`npm run act2`

See `package.json` file for scripts. Server is on port 3000, so go to <http://localhost:3000> to view.

To login as a student, use the following username and password:

```javascript
"username": "stu",
"password": "stu",
"role": "student",
```

To login as an instructor use the following username and password.

```javascript
"username": "admin",
"password": "admin",
"role": "instructor"
```

To test fail cases on login, try some other input variations, accessing  unauthorized pages, 404s, etc.

Please let me know if you have any questions.

### FAQService00 Class API Object Overview

#### FakeDatabase: Class to hold fake database for authentication

- Not directly accessed
- constructor():  instantiates `this.db` with username, password, and role.

#### FAQService: Server Method overview

- creates fakeDataBase object on initilization.

#### FAQService Method overview

- `createServer() callback`:
  - creates server on port 3000 by default.
  - handles GET and POST requests.
  - implements a `listen() callback` on port.
- `homePage(req, res, formData)`: set the home page based on the user login role.  This page is accessed after user login is validated.
- `processFormData(req, res, resultFunc)`: get form data input from login form and logout form. returns callback with data.
- `checkLogin(postData)`: Authenticates user login.
- `checkAuthorization(postData)`: helper function for `checkLogin()` to unauthorized access requests.
- `routePath(req, res)`: handles GET request url routing.
- `loginPage(req, res)`: sets login page and handles cookie data if present.
- `logout(req, res, resultFunc)`: Logs out user and redirects to login page.
- `pageNotFound(res)`: sets 404 request page and links back to login screen.
- `unAuthorizedAccess(res)`: set unAuthorized page and links back to login page.
- `loginInvalid(res)`: Sets login page with text letting user know username/password combination failed and to try to log in again.

[Back to Top](#Contents)

### Activity 3: Put it all together

To start server for activity 3, run:

`npm run start`

Please see the package.json file for scripts available. No dependencies used.

API similar to activity 2, with added functionality; uses the FakeDatabase class, and FAQ class.  The `filter()`  method in FAQ class had to be modified to function with the FAQService class.

#### Navigation notes

You can use the `search button` to filter and pull search results. if result populate, to reset filter results, hit the `search button` again or while in any of the search filter fields, hit `enter`. It will send an empty filter that displays all results.

When logged in as an instructor, the /edit page is not accessible from entering URL manually.  This is done on purpose to ensure the user selects a QA to edit first.  

#### FAQService API Overview

- FakeDatabase class:  class to hold a fake database for user lookup information.
  - `setActiveStatus`:  sets status of user (workaround for cookie issues (cookies were not holding in browser)).

- `createServer() callback`:
  - creates server on port 3000 by default.
  - handles GET and POST requests.
  - implements a `listen() callback` on port.
- `routeGetPaths(req, res)`: Method to route get requests.  
- `routePostPaths(req, res)`: Method to routes post requests.  
- `routePath(req, res)`: Helper method for GET method to route url paths.
- `displayQAItems(items, role)`: Method to display QA Items on home page.
- `deleteQA(id, faq)`: Method to delete QA from faq datastore.
- `editSaveQA(req, res, formData, faq)`: Method to edit QA from faq datastore.
- `homePage(req, res, formData, faq)`: set the home page based on the user login role.  This page is accessed after user login is validated.
- `processFormData(req, res, resultFunc)`: get form data input from login form and logout form. returns callback with data.
- `findRole()`: method to check role status for instructor or student. temporary fix for holding role.
- `findUsername(req)`: Helper method to get username from cookie.
- `checkLogin(postData)`: Authenticates user login.
- `checkAuthorization(postData)`: helper function for `checkLogin()` to unauthorized access requests.
- `manageQA(req, res, formData)`: Method to set edit and add page, instructor access only.
- `editContentPage(formData)`: Method to set the content for the /edit page. instructor access only.
- `addContentPage()`: Method to set the content for the /add page. Instructor access only.
- `setPageHead(username, role)`: Method to set the page head with the message and logout button that are on each page.
- `homepageContentBody(username)`: Method to set the homepage content body.
- `loginPage(req, res)`: sets login page and handles cookie data if present.
- `logout(req, res, resultFunc)`: Logs out user and redirects to login page.
- `addQASave(req, res, formData, faq)`: Method to add a new QA to the faq data store.
- `addQACheck(formData)`: Method to validate add QA form.
- `pageNotFound(res)`: sets 404 request page and links back to login screen.
- `unAuthorizedAccess(res)`: set unAuthorized page and links back to login page.
- `loginInvalid(res)`: Sets login page with text letting user know username/password combination failed and to try to log in again.
- `serverLog(message)`: Method to normalize server console logs.

Please let me know if you have any issues or questions.  Thanks.  

[Back to Top](#Contents)

## Lab 3

### Activity 1: Article Review System

Utilized node Express backend and Pug to render pages.

To start lab, navigate to the "activity1" folder, then run in CLI:

`npm run start` or `npm run dev`

All requirements from Lab should be met.

### Activity 2 and 3: Roommate Finder with Admin Functionality

Builds on what was learned from activity 1, utilized Express, Express-session,  and Pug.  

To start lab, navigate to the "activity2" folder, then run in CLI:

`npm run start` or `npm run dev`

To login to the admin page, credentials:
    username === password
    Ex: username=`admin` password=`admin`

All requirements from Lab should be met. Extra credit async/await behavior implemented.  Extra credit add a database (mongodb) attempted, but ultimately discarded due to time constraints.  

[Back to Top](#Contents)

## Lab 4

[Back to Top](#Contents)
