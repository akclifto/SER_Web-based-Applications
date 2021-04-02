"use strict";

function third(x) {
  return(x / 3);
}

function triple(x) {
  return(x * 3);
}

function nineTimes(x) {
  return(x * 9);
}

function operate(f) {
  let nums = [1, 2, 3];
  for(let i=0; i<nums.length; i++) {
    let num = nums[i];
    console.log("Operation on " + num + " is " + f(num));
  }
}

operate(third);
operate(triple);
operate(nineTimes);
