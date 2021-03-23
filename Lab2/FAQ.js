/**
 * SER 421 Lab 2
 * Acitivity 1: File I/O
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.13
 * 
 * See Lab2_ReadMe.txt for information.
 * 
 */
import { readFileSync, writeFileSync } from 'fs';
import path from "path";

const __dirname = path.resolve();

// Class to hold QA objects
class QA {

    constructor(question, answer, tags, author, date, id) {
        this.question = question;
        this.answer = answer;
        this.tags = tags;
        this.author = author;
        this.date = date;
        this.id = id;
    }
}

// Class to handle all functionality.
class FAQ {

    constructor(jsonFile) {
        this.dataStore = this.loadQA(jsonFile);
    }

    /**
     * Method to load data from json file synchronously per constraints C1.
     * @param {string} json : json file to load
     * @returns parsed json data for local storage
     */
    loadQA(jsonFile) {

        const options = { encoding: 'utf8', flag: 'r' };
        let qas = readFileSync(jsonFile, options);
        try {
            return JSON.parse(qas);
        } catch (err) {
            console.log("Error in loadQA: ", err);
        }
    }

    /**
     * Method to manually write in a QA.
     * // R1. The ability to write a Q&A to the persistent store 
     *    (sample JSON of the Q&A is provided)
     * @param {*} question : new question
     * @param {*} answer : new answer
     * @param {*} author : author of QA
     * @param {*} date : date of entry
     * @param {*} tags : associated tags
     * @returns string context of pass/fail execution
     */
    writeQA(question, answer, tags, author, date) {

        //check valid input
        let writes = [question, answer, tags, author, date];
        for (let i in writes) {
            if (writes[i] === "" || writes[i] === undefined) {
                console.log("writeQA: ", "Write not stored. Empty or undefined parameters.");
                return "Write not stored. Some fields were missing or empty/undefined parameters.";
            }
        }

        try {
            let id = this.genId();
            let qa = new QA(question, answer, tags, author, date, id);

            // annoying conversions to clear the bad json format
            const toStore = JSON.stringify(qa);
            this.dataStore.push(JSON.parse(toStore));
            this.storeToFile(this.dataStore);
            return "Write complete.  New QA stored.";

        } catch (err) {
            console.log("Error in writeQA: ", err);
            return "Write not stored. Check Error Log.";
        }
    }

    /**
     * Method to update answer in persistent store. Found by id.
     * // R2. The ability to update the content (answer text) of an 
     *    existing Q&A from the existing persistent store
     * @param {*} id : id to update
     * @param {*} answer : answer to replace id.answer
     * @returns string context of pass/fail execution
     */
    updateAnswer(id, answer) {

        let qaIndex = this.getId(id);
        if (qaIndex === -1) {
            // console.log("Id not found in persistent store.");
            console.log("FAQ: ", "Id not found in persistent store.");
            return false;
        } else {
            this.dataStore[qaIndex].answer = answer;
            this.storeToFile(this.dataStore);
            console.log("FAQ: ","Answer updated to: \"" + this.dataStore[qaIndex].answer + "\"");
            return true;
        }
    }

    /**
     * Method to update tags for QA in persistent store. Found by id.
     * // R3. The ability to update the tags for a Q&A from the existing
     *    persistent store.
     * @param {*} id : id to update
     * @param {*} tags : tags to replace id.answer
     * @returns string context of pass/fail execution
     */
    updateTags(id, tags) {
        let qaIndex = this.getId(id);
        if (qaIndex === -1) {
            // console.log("Id not found in persistent store.");
            return "Id not found in persistent store.";
        } else {
            this.dataStore[qaIndex].tags = tags;
            this.storeToFile(this.dataStore);
            return "Tags updated to: " + this.dataStore[qaIndex].tags;
        }
    }

    /**
     * Method to delete a QA from persistent store. Found by Id.
     * // R4. The ability to delete a Q&A from an existing persistent store.
     * @param {*} id : id to remove
     * @returns string context of pass/fail execution
     */
    deleteQA(id) {
        let qaIndex = this.getId(id);
        if (qaIndex === -1) {
            // console.log("Id not found in persistent store.");
            return false;
            // return "Id not found in persistent store.";
        } else {
            this.dataStore.splice(qaIndex, 1);
            this.storeToFile(this.dataStore);
            return true;
            // return "QA with id " + id + " removed from store.";
        }
    }

    /**
     * Method to filter user specified options, then returns collections to user.
     *   R5. The ability to return a collection of Q&As based on a filter, where the filter checks for one or
     *   more of the criteria such as:
     *       a. Author
     *       b. Date Range (start, end)
     *       c. Tags
     * @param {*} filterParams : parameters for filtering contrained to a-c in comment above
     * 
     */
    filter(filterParams) {

        let filteredQA = this.dataStore;
        // console.log("Filter author:", filterParams.author);
        // console.log("Filter startdate:", filterParams.startdate);
        // console.log("Filter enddate:", filterParams.enddate);
        // console.log("Filter tags:", filterParams.tags);

        if (filterParams.author) {
            filteredQA = filteredQA.filter(qa => qa.author.toLowerCase().includes(filterParams.author.toLowerCase()));
        }
        if (filterParams.startdate) {
            filteredQA = filteredQA.filter(qa => 
                qa.date >= filterParams.startdate || 
                qa.date.includes(filterParams.startdate));
        }
        if (filterParams.enddate) {
            filteredQA = filteredQA.filter(qa => 
                qa.date <= filterParams.enddate ||
                qa.date.includes(filterParams.enddate));
        }

        if (filterParams.tags) {
            filteredQA = filteredQA.filter(qa => qa.tags.toLowerCase().includes(filterParams.tags.toLowerCase()));
        }

        // check if anything returned after filtering
        if (filteredQA.length === 0) {
            console.log("FAQ: ", "No Results produces from specified filters.");
            return filteredQA;
        } else {
            return filteredQA;
        }
    }

    /**
     * Helper method to generate random id for new QAs
     * @returns random float id
     */
    genId() {
        let left = Math.floor(Math.random() * 1000000000).toString();
        let right = Math.floor(Math.random() * 100000).toString();
        let genID = left.concat(".").concat(right);
        // console.log(parseFloat(genID).toFixed(4));
        genID = parseFloat(genID).toFixed(4);

        for (let i in this.dataStore) {

            if (genID === this.dataStore[i].id) {
                console.log("Getting unique id...");
                this.genId();
            }
        }
        return genID;
    }

    /**
     * Helper method to find id index in dataStore.  
     * Use this bit of code a lot, so making own method.
     * @param {*} id : id to find
     * @returns id if found, -1 otherwise.
     */
    getId(id) {
        return this.dataStore.findIndex((qaBlock) => qaBlock.id == id);
    }

    /**
     * Method to write JSON file to storage
     * @param {*} dataStore : store to write to file
     * @returns string context of pass/fail execution
     */
    storeToFile(dataStore) {
        try {
            let qas = JSON.stringify(dataStore);
            // console.log(qas);
            writeFileSync("./Lab2/QA.json", qas);
            return "Store written to file";
        } catch (err) {
            console.log("storeToFile Error: " + err);
            return "Store not written to file.";
        }
    }

    /**
     * Method to restore JSON file from backup if something goes wrong, or just to reset 
     * to example file.
     * @returns true if successful, false otherwise. 
     */
    restoreBackupFile() {
        const options = { encoding: 'utf8', flag: 'r' };
        try {
            let qas = readFileSync(__dirname + "/Lab2/QA_backup.json", options);
            this.dataStore = JSON.parse(qas);
            this.storeToFile(this.dataStore);
            console.log("File restored from backup.");
            return true;
        } catch (err) {
            console.log("Error in loadQA: ", err);
            return false;
        }
    }
}

export default FAQ;
