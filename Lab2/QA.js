/**
 * SER 421 Lab 2
 * Acitivity 1: File I/O
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.13
 * 
 * QA class is the object used to store each QA from the FAQ.  
 */

export default class QA {

    constructor(question, answer, tags, author, date, id) {
        this.question = question;
        this.answer = answer;
        this.tags = tags;
        this.author = author;
        this.date = date;
        this.id = id;
    }
}