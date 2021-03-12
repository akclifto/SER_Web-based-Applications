// Example attributed to Ch. 2 of Mixu's Node Book, http://book.mixu.net/node/ch2.html

/**  This example makes use of explicit timers
 *  Note that myTimer is on shorter interval than the while loop below it.  myTimer will have to wait for the next
 *  while loop to complete for it finishes.
 * 
 * for setInterval, note console log starts mytimer, then does while loop, then proceeds with interval.
 *      It shows that how the process cycle as they get processed.
 * 
 * for setImmediate, this ensure process req gets executed before the while loop below it. setImmediate gives it priority.
 */

var myTimer = setTimeout(function() { //try setTimeout, setInterval, setImmediate
    console.log('Timeout at ' + new Date().toTimeString());
}, 500); // comment out  ', 500);
 myTimer.unref();  // if timers are all that is left exit (comment out for setInterval)

// start time
var sTime = new Date();
console.log('Started app processing loop at ' + sTime.toString());

let i = 0;
while (new Date().getTime() < sTime.getTime() + 1500) { // timer stall for 1500ms, or 1.5 seconds
    i++;
}

console.log('Exiting processing loop at ' + new Date().toTimeString() + ' after ' +i+ ' iterations');
