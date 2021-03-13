/**
 * SER 421 Lab 2
 * Acitivity 1: File I/O
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.13
 * 
 */
import path from "path";
import { readFileSync, read } from 'fs';
import QA from "./QA.js";

const __dirname = path.resolve();


class FAQ {

    constructor(jsonFile) {
        this.dataStore = this.loadQA(jsonFile);
        console.log(this.dataStore);
    }

    /**
     * Async Attempt to read file.
     * @param {*} jsonFile 
     * @returns 
     */
    loadTest(jsonFile) {

    }

    /**
     * LoadQA loads data from json file.
     * @param {string} json : json file to load
     * @returns parsed json data for local storage
     */
    loadQA(jsonFile) {
    
        const options = {encoding:'utf8', flag:'r'};
        let qas = readFileSync(jsonFile, options);
        try {
            return JSON.parse(qas);
        } catch (err) {
            console.log("Error in loadQA: ", err);
        }
    }
}




FAQ.prototype.writeQA = function (question, answer, author, date, tags) {
    
    //TODO: 
    // R1. The ability to write a Q&A to the persistent store (sample JSON of the Q&A is provided)
}
FAQ.prototype.updateQA = function (id, answer) {
    //TODO:
    // R2. The ability to update the content (answer text) of an existing Q&A from the existing persistent store
}
FAQ.prototype.updateTags = function (id, tags) {
    //TODO:
    // R3. The ability to update the tags for a Q&A from the existing persistent store.
}
FAQ.prototype.deleteQA = function (id) {
    //TODO:
    // R4. The ability to delete a Q&A from an existing persistent store.
}
FAQ.prototype.filter = function(options) {
    //TODO
    /* R5. The ability to return a collection of Q&As based on a filter, where the filter checks for one or
        more of the criteria such as:
        a. Author
        b. Date Range (start, end)
        c. Tags
    */
}


new FAQ(__dirname + "/QA.json");

