/**
 * SER 421 Lab 2
 * Acitivity 1: File I/O
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.13
 * 
 */
import path from "path";
import { readFileSync } from 'fs';
import QA from "./QA.js";

const __dirname = path.resolve();

class FAQ {

    constructor(jsonFile) {
        this.dataStore = this.loadQA(jsonFile);
    }

    /**
     * LoadQA loads data from json file.
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
     * @param {*} question 
     * @param {*} answer 
     * @param {*} author 
     * @param {*} date 
     * @param {*} tags 
     */
    writeQA (question, answer, tags, author, date) {

        //check valid input
        let writes = [question, answer, tags, author, date];
        for(let i in writes) {
            if(writes[i] === "" || writes[i] === undefined){
                console.log("writeQA: ", "Write not stored. Empty or undefined parameters.");
                return false;
            }
        }
        
        try {
            let id = this.getId();
            let qa = new QA(question, answer,tags, author, date, id);
    
            // annoying conversions to clear the bad json format
            const toStore = JSON.stringify(qa);
            let toParse = JSON.parse(toStore);
            toParse.id = id
            this.dataStore.push(JSON.parse(toStore));
            return true;
        } catch (err) {
            console.log("Error in writeQA: ", err);
            return false;
        }
    }

    /**
     * Method to generate random id for new QAs
     * @returns random float id
     */
    getId() {
        let left = Math.floor(Math.random() * 1000000000).toString();
        let right = Math.floor(Math.random() * 100000).toString();
        let genID = left.concat(".").concat(right);
        // console.log(parseFloat(genID).toFixed(4));
        genID = parseFloat(genID).toFixed(4);

        for(let i in this.dataStore){

            if(genID === this.dataStore[i].id) {
                console.log("Getting unique id...");
                this.getId();
            }
        }
        return genID;
    }
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
FAQ.prototype.filter = function (options) {
    //TODO
    /* R5. The ability to return a collection of Q&As based on a filter, where the filter checks for one or
        more of the criteria such as:
        a. Author
        b. Date Range (start, end)
        c. Tags
    */
}



const faq = new FAQ(__dirname + "/QA.json");
// console.log(faq.dataStore);
console.log(faq.writeQA("quest", "ans"));
// console.log(faq.dataStore);



    // /**
    //  * Async Attempt to read file async.
    //  * @param {*} jsonFile 
    //  * @returns nothing, doesn't work
    //  */
    // async loadTest(jsonFile) {
    //     const options = { encoding: 'utf8', flag: 'r' };
    //     readFile(jsonFile, options, function (err, data) {
    //         if (err) {
    //             console.log("Error in loadTest: ", err);
    //         } else {
    //             let qas = JSON.parse(data);
    //             return qas;
    //         }
    //     });
    // }