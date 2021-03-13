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

`npm run act1`

- Activity 2: Implement a Simple FAQ Service
- Activity 3: Put it all together

[Back to Top](#Contents)
