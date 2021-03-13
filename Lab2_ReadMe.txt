/**
 * SER 421 Lab 2
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * 
 */
----------------------------------------------------------------------------------
 Please let me know if you have any questions.

This Lab will use the same structure for the json file as provided in QA.json.
All scripts will be provided in the package.json file along with any dependencies.

----------------------------------------------------------------------------------
ACTIVITY ONE:--------------------------------------------------------------------- 

This has no 3rd party dependencies other than one for dev purposes.
To run the test file that covers requirements R1 - R5, run the following in terminal:

npm run act1

To instantiate object for own testing:
    `const varName = new FAQ(<path/to/jsonFile>);`

See test FAQ00_test.js to see general call structure.

Class Object Overview:

  QA:  Class to hold QA objects.  Not directly accessed in test file.
    constructor:  question, answer, tags, author, date, id  (in that order)

  FAQ: Class that handles all functionality of Activity 1 

    constructor: jsonFile (<path/to/jsonFile> to load file that instantiates program)
        jsonFile is top level called "QA.json" and should function running `npm run act1` command
  
  FAQ Method Overview: 
    
    loadQA(jsonFile):  auto-called in constructor.  Do not need to directly access.

    writeQA(question, answer, tags, author, date):  manually write a new QA to store
        - If successfully written, will auto store to persistent file.
        - See `Testing R1:` in FAQ00_test.js for usage.

    updateAnswer(id, answer): method to update answer given by id
        - requires to know id to change answer.  I'm presuming in the web app,
          user will select QA block they want to update, and this method will be
          handled implicitly
        - See `Testing R2:` in FAQ00_test.js for usage.

    updateTags(id, tags): method to update tags given by id
        - requires to know id.  See updateAnswer() method bullet-point
        - See `Testing R3:` in FAQ00_test.js for usage.

    deleteQA(id): method to remove QA block from store.
        - requires to know id.  See updateAnswer() method bullet-point
        - See `Testing R4:` in FAQ00_test.js for usage.

    filter(filterParams): Method to filter contect and return collection to user.
        - valid filters are author, dateRange, and tags. Format:
            let someFilters = { author: <authorName>, dateRange: <dateRange>, tags: <tags> }
            Partial filter is optional, ex: let someFilter = { author: "dr" } will return 
            collection with all authors start with "dr" substring. (which is everyone but Ruben)
        - See `Testing R5:` in FAQ00_test.js for usage.
    
    genId() : helper method that generates a random float id.  Do not need to directly access.

    getId(id): helpter method to return index of id in store collection. Do not need to directly access.

    storeToFile(dataStore): method that sync write to QA.json file. 
        - See `Testing Write to JSON file:` in FAQ00_test.js for usage.
    
    restoreBackupFile():  method that restore original QA.json file given in lab2
        - See `Testing Backup Restore of JSON file:` in FAQ00_test.js for usage.

----------------------------------------------------------------------------------
ACTIVITY TWO:--------------------------------------------------------------------- 
    
    
