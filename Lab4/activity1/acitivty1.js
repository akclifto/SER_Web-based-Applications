/**
 * SER 421 Lab 4
 * Acitivity 1: DOM Expressions
 * @author Adam Clifton
 * @email akclifto@asu.edu
 * @date 2021.04.05
 */

//  Now, for this activity, write DOM expressions that do the following (write these in a activity1.js file):

//  1. (3) Output to the console the <ol> element encompassing the results of the search
document.getElementsByTagName("ol"); // for all <ol> results.
document.getElementsByTagName("ol").namedItem("b_results"); // for just the "results" list (no maps or photos)

//  2. (4) Output to the console the code for the "onload" event on the <body> element
document.querySelector("body").onload;

//  3. (3) Output to the console the 2nd child node underneath the <body> element
document.querySelector("body").childNodes[1];

//  4. (3) Output to the console the number of <h2> tags in the page
document.getElementsByTagName("h2").length;

//  5. (3) Output to the console the value in the search bar (you must get this from the search bar not anywhere else on the page)
document.getElementById("sb_form_q").value;

//  6. (4) Make the "Add Bing New Tab Extension" text in the upper right corner result go away
// There is no "Add Bing New Tab Extension" text, so I removed my account name and reward score with the follow two remove() calls.
document.getElementById("id_n").remove();
document.getElementById("id_rh").remove();
