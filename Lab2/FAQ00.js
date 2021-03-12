/**
 * SER 421 Lab 2
 * Acitivity 1: File I/O
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.13
 * 
 */
import { readFile } from 'fs';
import QA_file from "./QA.json";


class FAQ {

    constructor(jsonFile) {

        this.storeQA(jsonFile);

        this.id;
        this.question;
        this.answer;
        this.author;
        this.date;
        this.tags;
    }

    storeQA(jsonFile) {
        var options = { encoding: 'utf8', flag: 'r' };
        readFile(jsonFile, options, function (err, jsonData) {
            if (err) {
                console.log("Failed to load JSON File");
                console.log("Error", err);
            } else {
                var qas = JSON.parse(jsonData);
                for(let i = 0; i < qas.length; i++) {
                    console.log(qas[i]);
                }
            }
        });
    }


    writeQA(jsonFile) {
        //TODO: 
        // R1. The ability to write a Q&A to the persistent store (sample JSON of the Q&A is provided)
    }

    updateQA(id, answer) {
        //TODO:
        // R2. The ability to update the content (answer text) of an existing Q&A from the existing persistent store
    }

    updateTags(id, tags) {
        //TODO:
        // R3. The ability to update the tags for a Q&A from the existing persistent store.
    }

    deleteQA(id) {
        //TODO:
        // R4. The ability to delete a Q&A from an existing persistent store.
    }

    filter(options) {
        //TODO
        /* R5. The ability to return a collection of Q&As based on a filter, where the filter checks for one or 
            more of the criteria such as:
            a. Author
            b. Date Range (start, end)
            c. Tags 
        */
    }
}

const faq = new FAQ(QA_file);
console.log(faq);


