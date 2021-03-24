// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

import { request, createServer } from 'http';
import { parse } from 'querystring';
// import url from 'url';

function sendResponse(weatherData, res) {
    var page = '<html><head><title>External Example</title></head>' +
        '<body>' +
        '<form method="post">' +
        'City: <input name="city"><br>' +
        '<input type="submit" value="Weather">' +
        '</form>';
    if (weatherData) {
        page += '<h1>Weather Info</h1><p>' + weatherData + '</p>';
    }
    page += '</body></html>';
    res.end(page);
}

// this function acts as the browser to due the parsing.  Normally do this client-side then send off to server.
function parseWeather(weatherResponse, res) {
    var weatherData = '';
    weatherResponse.on('data', function (chunk) {
        weatherData += chunk;
    });
    weatherResponse.on('end', function () {
        sendResponse(weatherData, res);
    });
}

// You will need to go get your own free API key to get this to work
//  the included key works to retrieve data, but it's in a json string
function getWeather(city, res) {
    var options = {
        host: 'api.openweathermap.org',
        path: '/data/2.5/weather?q=' + city + "&APPID=d3772e348ab8cf35f9877845f6942efb"
    };
    request(options, function (weatherResponse) {
        parseWeather(weatherResponse, res);
    }).end();
}

createServer(function (req, res) {
    console.log(req.method);
    if (req.method == "POST") {
        var reqData = '';
        req.on('data', function (chunk) {
            reqData += chunk;
        });
        req.on('end', function () {
            var postParams = parse(reqData);
            getWeather(postParams.city, res);
        });
    } else {
        sendResponse(null, res);
    }
}).listen(8088);
