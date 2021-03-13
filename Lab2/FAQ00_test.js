/**
 * SER 421 Lab 2
 * Acitivity 1: File I/O Test
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.13
 * 
 */
import FAQ from './FAQ00.js';
import path from "path";

const __dirname = path.resolve();


console.log("Actvity 1 Testing-----------------------------------------------\n");
// test read file and storage
console.log("\nTesting Read and File storage---------------------------------\n");

const faq = new FAQ(__dirname + "/Lab2/QA.json");
console.log(faq.dataStore);

//Test R1
console.log("\nTesting R1: Write QA to store---------------------------------\n");
// passing write
console.log(faq.writeQA("quest", "ans", "aTag", "auth", "datess"));
// failing write
console.log(faq.writeQA("quest", "auth", "datess")); //returns write not stored.

// Test R2
console.log("\nTesting R2: Update QA answer from store-----------------------\n");
// passing update
console.log("Check answer before update: \n", faq.dataStore[6]);
console.log(faq.updateAnswer(faq.dataStore[6].id, "someAnswer"));
console.log("Check updated answer: \n", faq.dataStore[6]);
// failing update
console.log(faq.updateAnswer(234.234, "otherAnswer")); // returns Id not found in persistent store.

// Test R3
console.log("\nTesting R3: Update QA tags from store-------------------------\n");
// passing update
console.log("Check tags before update: \n", faq.dataStore[5]);
let tags = "client, assign 4, node";
console.log(faq.updateTags(faq.dataStore[5].id, tags));
console.log("Check updated tags: \n", faq.dataStore[5]);
// failing update
console.log(faq.updateTags(654654.1, tags)); // returns Id not found in persistent store.

// Test R4
console.log("\nTesting R4: Delete QA from store------------------------------\n");
// passing delete
console.log("Number of items in store before deleteQA:", faq.dataStore.length);
console.log(faq.deleteQA(faq.dataStore[6].id));
console.log("Check Number of items in store after deleteQA:", faq.dataStore.length);
console.log("Should return undefined: ", faq.dataStore[6]);  //should return undefined
// failing delete
console.log(faq.deleteQA(23452342.234234));

