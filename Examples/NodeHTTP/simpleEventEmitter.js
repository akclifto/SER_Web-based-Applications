// modified from http://www.hacksparrow.com/node-js-eventemitter-tutorial.html
import { EventEmitter } from 'events';
var radium = new EventEmitter();

function cb(ray) {
    console.log(ray);
}
// on and addListener are the same thing
radium.addListener('radiation', cb);

radium.on('foo', function () {
    console.log("Boo hoo I will never get called");
});

radium.once('radiation', function (ray) {
    console.log("JUST ONCE " + ray);
});

/** this removelistener removes the addListener 'radiation' that was made above. */
setTimeout(function () {
    radium.removeListener('radiation', cb);
}, 5000);

setInterval(function () {
    radium.emit('radiation', 'GAMMA');
}, 500).unref();

// this gets called first because it is at the top level.  The others are in setTimeout/setInterval functions
radium.emit('foo', 'BETA');

