// This example originally posted by newspaint at
// https://newspaint.wordpress.com/2015/09/06/how-to-get-cookies-from-node-js-http-response/
// and customized for ser421
import { request as _request } from "http";
import { parse } from "url";

//connection gets refused.  This example is not the same as the one in the lecture vid `Node Http 3 Cookies`
var urlstring = "http://localhost/hi.html";
var parsedurl = parse(urlstring);
var cookies = [
    "foo=bar",
    "UofA=lastplace",
];

var options = {
    hostname: parsedurl.hostname,
    port: (parsedurl.port || 8088),
    method: 'GET',
    path: parsedurl.path,
    headers: {},
};
options.headers["Cookie"] = cookies.join("; ");

// An example of how to create a request object and send it
// Note the callback to process the response
var request = _request(
    options,
    function (response) {
        // display returned cookies in header
        var setcookie = response.headers["set-cookie"];
        if (setcookie) {
            setcookie.forEach(
                function (cookiestr) {
                    console.log("COOKIE:" + cookiestr);
                }
            );
        }

        var data = "";
        response.on(
            "data",
            function (chunk) { data += chunk; 
            }
    );

response.on(
    "end",
    function () {
        console.log("STATUS:" + response.statusCode);
        console.log( "  DATA:" + data );  // this gets too obnoxiously long
    }
);
  }
);

request.on(
    "error",
    function (err) {
        console.error("ERROR:" + err);
    }
);

request.end(); // let request know it is finished sending
