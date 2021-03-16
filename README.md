# SER-421 Web-based Applications

SER421: Web-based Applications Assignment Overview

## Contents

- [Lab 1](#Lab-1)
- [Lab 2](#Lab-2)

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

- Activity 1: File I/O

This lab builds on concepts from Lab1. Scripts will be used from this point forward for these labs.  Check the `package.json` file for scripts. To run the test file for activity 1:  

`npm run act1`.

To instantiate object for own testing: `const varName = new FAQ(<path/to/jsonFile>);`

See test `FAQ00_test.js` to see general call structure.

### Class Object Overview

#### QA:  Class to hold QA objects.  Not directly accessed in test file
  
- constructor:  question, answer, tags, author, date, id  (in that order)

#### FAQ: Class that handles all functionality of Activity 1

- constructor: jsonFile (<path/to/jsonFile> to load file that instantiates program)
  - jsonFile is top level called "QA.json" and should function running `npm run act1` command

#### FAQ Method Overview

- loadQA(jsonFile):  auto-called in constructor.  Do not need to directly access.
- writeQA(question, answer, tags, author, date):  manually write a new QA to store
  - If successfully written, will auto store to persistent file.
  - See `Testing R1:` in FAQ00_test.js for usage.
- updateAnswer(id, answer): method to update answer given by id
  - requires to know id to change answer.  I'm presuming in the web app,    user will select QA block they want to update, and this method will be handled implicitly
  - See `Testing R2:` in FAQ00_test.js for usage.
- updateTags(id, tags): method to update tags given by id
  - requires to know id.  See updateAnswer() method bullet-point
  - See `Testing R3:` in FAQ00_test.js for usage.
- deleteQA(id): method to remove QA block from store.
  - requires to know id.  See updateAnswer() method bullet-point
  - See `Testing R4:` in FAQ00_test.js for usage.
- filter(filterParams): Method to filter contect and return collection to user.
  - valid filters are author, dateRange, and tags. Format:
  `let someFilters = { author: <authorName>, dateRange: <dateRange>, tags:<tags> }`
  - Partial filter is optional, ex: `let someFilter = { author: "dr" }` will return collection with all authors start with "dr" substring. (which is everyone but Ruben)
  - See `Testing R5:` in FAQ00_test.js for usage.
- genId() : helper method that generates a random float id.  Do not need to directly access.
- getId(id): helpter method to return index of id in store collection. Do not need to directly access.
- storeToFile(dataStore): method that sync write to QA.json file.
  - See `Testing Write to JSON file:` in FAQ00_test.js for usage.
- restoreBackupFile():  method that restore original QA.json file given in lab2
  - See `Testing Backup Restore of JSON file:` in FAQ00_test.js for usage.

- Activity 2: Implement a Simple FAQ Service

To start server, run:

`npm run start` or `npm start`

Server is on port 3000, so go to <http://localhost:3000> to view.

To login as a student, use the following username and password:

```javascript
"username": "stu",
"password": "dent",
"role": "student",
```

To login as an instructor use the following username and password.

```javascript
"username": "inst",
"password": "admin",
"role": "instructor"
```

To test fail cases on login, try some other input variations, accessing  unauthorized pages, 404s, etc.

Please let me know if you have any questions.



- Activity 3: Put it all together

[Back to Top](#Contents)
