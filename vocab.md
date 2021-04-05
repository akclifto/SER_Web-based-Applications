# Vocab from Videos

- [Module 2](#Module-2)
- [Module 3](#Module-3)
- [Module 4](#Module-4)

## Module 2

### HTTP attributes

`Synchronous`: Each request has a corresponding response. Requester will block until response is received.
`Asynchronous`: We send a request and continue program execution. Does not block waiting for the response.
`Stateless`: The response of the current request DOES NOT depend on responses to previous requests.
`Stateful`: The response of the current request WILL depend on responses to previous requests.
`Connection-Oriented`: Property of a network socket lifecycle.

- `Connectionless`: HTTP handles request and then immediately closes connection after response is done.
- `Connection-Oriented`: Requester has to initiate disconnected, otherwise connection will stay open.
  `Impedence Mismatch`: Writing _stateful_ programs that are transmitted over _stateless_ HTTP. We have to fake the statelessness in our application.

### HTTP Methods

`GET`: Makes request to resourse. Meant to be a query; shouldn't change state.  
`POST`: Used to pass input to server.

- GET encodes url, POST puts it in the body of the message.
- POST handles binary payloads, makes them invisible, and can support input requests of an arbitrary length (w/ Content-Length).
- Other options: OPTIONS, PUT, DELETE, CONNECT, TRACE, PATCH

### Cookies

Server sends a simple name : value pair to client. When client comes back to site, cookie gets sent to server indicating a returning user. Client doesn't have to accept cookies; a lot of privacy-focused browsers block 3rd-party cookies by default, and have option to block all cookies.
Dynamic webpages require cookies to function. _Privacy concerns_. Cookies can have expiration dates ranging from whenever the user session ends (the one-time stop on a website), to a few hours to decades!

Typical uses:

- ID user during e-commerce session
- Avoiding username and password. (bad!) don't do this
- site personalization or customization
- focused advertizing

Types:

- Session: session browser instance only
- Persistent: time period specific
- Secure: only transmitted over HTTPS by indicating `secure flag`, helps against snooping or cookie stealing
- HttpOnly: Prevents reading cookie values in JS by using `HttpOnly flag`, avoid malicious JS that compromise cookie info.

[Back to Top](#Vocab-from-Videos)

## Module 3

### Video 1: ServerState18

Different types of State:

- Application state: the lifecycle of your application process itself
- User preferences state: understanding who the user is, what they want to do, and how they want to interact with the web app.
- World State: info independent of a specific program
- conversational state: the topic of the first video, below:

`Conversational State`: represents a bounded "conversation" or interaction between a client and server.

Conversation state management, ranked from worst to best:

- hidden values on Forms: easy to break or steal.
- URL rewriting: better than hidden forms, but has same problems
- Cookies: can persist beyound session intentions
- SSL: Best, but pain from UX and computational scalability standpoint.
- Session-oriented middleware: topic for another time, but is the direction web apps are going.

Should use a session framework instead of making your own.  
Make sure session ids are not based on security or privacy information, and that they are temporal GUIDs (global unique identifier).

It's more important now to have session oriented frameworks to persis user info and hold settings without having security or privacy breaches.

### Video 2: Node MVC with Express Overview

`N-tier layers:` not a software concept; it's a physical deployed architecture concept

- client: runtime (desktop, mobile, etc.) `layer 1`
- HTTP server: `layer 2`
- Application servers: nodeJS etc. `layer 3`
- Connectors: smtp, B2B, etc. `layer 4`

N-tier is the layers from client layer 1 ... layer N for a web applicaiton

`Separation of concerns (SoC)`: decoupling principle, architectural style, not a design pattern

- Data access: how we access data and where's it stored
- business logic: organization value. independent of specific apps (domain/model objects used to handle all types of clients)
- presentation: rendering stuff to user. what tech uses and whos responsible for it.

You don't want these to change too much based on the others. Data access should not affect business logic and rendering should not affect data access and so on.

`MVC pattern steps with node/express`, different from req/res process steps:

- 1: Front controller: map url and other info. App specific.
- 2: process parameters of request.
- 3: Route match to controller, interact with biz logic and data in model objects. (db, etc.)
- 4: When processing complete, goes back to controller to select and apply the view (template pattern).
- 5: Set res headers in view template.
- 6: write out the content (HTML).

`MVC`:

- View: presentation: projection, what is the content type returned and what content to end user.
  - view can NEVER modify the model.
- Model: comes from the datasources (world model like dbs). App independent, reusable.
- Controller: routes requests (is NOT the biz logic). It's really the appl logic. App specific.

`Implementing MVC`:

1. HTTP request made to router/controller
2. Controller (routes or delegates) to the Model
3. The model executes the business logic on the world model (non-volatile state, typically a datasource).
4. The controller iIDs the appropriate View template.
5. The view (read-only) accesses the model to ge tthe dynamic output.
6. The view produces the final rendered response to the client browser.

### Video 2: Node MVC with Express - Using Express

```javascript
app.get("/", function (req, res) {
  //route 1, binds path to callback
  let response = <html> ... </html>;
  res.status(200);
  res.set({ "content-type": "text/html", "content-length": resposne.length });
  res.send(response);
  // logs
});

app.get("/error", function (req, res) {
  //route 2
  res.status(400);
  res.send("This is a bad request");
});
```

`app.get('/')` is called a route.

`Express req and res objects`  
The request object wraps an HTTP request object with a convneience API.Ex, can get any header with `req.get(<header>)` or req.headers. See `express_request.js` example.

The response object wraps an HTTP response. You set header with `res.set(header, val)`, and others. See slide 14 of 20 on `Module 3 - NodeMVCWithExpress` pdf.

### Video 3: Node MVC with Express - The View part of MVC with EJS and Pug

View part is where we assemble the response payload (step 4 in the req/res process pattern). It is also corresponds to the presentation part of the SoC. It is a 1:1 mapping.

Theres a bunch of ways to render the view; the video focuses on templates. see `express_template.js` example for ejs and pug usage.

`Template engines` = mix and match static and dynamic content.

- web UI devs would create the static parts of the page. (as we know, web devs not do full stack, there's almost no separation between them and wep app devs.).
- backend devs create dynamic parts (see not above about web devs)
- UI devs owned the structure, or loayout of a page.
  - holes left for dynamic devs to fill in
  - result: box-ey layouts that you still see today.

PROS:

- still SoC
- AJAX friendly
- lets each dev role stick to what theyre good at doing
- the UI now started with the markup, not the other way around.

CONS:

- not a lot of layout flexibility, not "responsive"
- proprietary scripting languages. BOOOO.

`The view: other techniques`:

- XML/XSLT - is computationally expensive
- Browser-plugins / embedded viewers (flash, silverlight, applets, etc.). These used to embed full UI state into DL'd object. Evolved to accept the presentation info and dynamically render in the "player". HTML5 is replacing it rapidly.

### Video 4: Node MVC with Express - Middleware Concepts

Middleware layer coordinates interaction with all the services of your model and biz logic. Its a structual pattern thats ... IN THE MIDDLE between server stuff and model/logic/db stuff
Examples:

- MOM: messaging oriented middleware (message system)
- distributed transactions between dbs
- ESB: enterprise service bus

common middleware libraries:

- `json`: parse JSON request payloads, popular with REST APIs
- `urlencoded` - parse `applicaiton/x-www-form-urlencoded` request payloads
- `body-parser` - includes both json and urlencoded
- `compress` - compress response data with gzip
- `query` - converts query string into js object
- `static` - serves static files
- `cookie-parser` - parses cookies
- `express-session` - handles user sessions

Node/express process pipeline:

app.get() => `app.use() -- (next()) => app.use() -- (next()) =>` app.render()

the `app.use()` calls get injected (Go4, decorator/interceptor?/chain of responsibility pattern) and is considered the middleware. The `next()` call continues the pipeline. The ordering of the pipeline depends on the order of routes set, and middleware up. It's important where things go!

This is why there are multi params on the callbacks in Express. Ex of middleware:

```javascript
// express_listen_middleware.js
let app = require('express')();

app.get('/', function (req, res,, next) {
    res.send("Hello from express");
    next(); // always call next at the end of callback, continues pipeline.
});

app.use('foo', function(req,res, next) { // can bind middleware to a path
    console.log("first app.use call");
    next(); // continuing the request pipeline
});

app.use(function(req,res, next) {
    console.log("second app.use call");
    next(); // continuing the request pipeline
});

app.use(function(req,res, next) {
    console.log("third app.use call");
    // Notice no next() call here. That means we're done.
    // now going on to render() or in this case, just to listen().
});

app.listen(8081);

```

## Promises

A promise represent the eventual result of an async operation. Promises resolve once, then are immutable.

`promise.all()`: takes iterable and retuns a promise that resolves whal ALL of the promises in the iterable have resolved or rejects when the 1st promise rejects. psuedo-parallelism.

`promise.race()`: takes an iterable and reutn a promise that resolves with the value of the FIRST PROMISE that resolved in the iterable, else rejects.

## Async Behavior

Node/JS gives feeling of parallelism, but is not really concurrent. It is logically concurrent (multiple call chains as part of one computation task executing at the same time). It is `non-determinism`.

[Back to Top](#Vocab-from-Videos)

## Module 4

### Video 1: Web Arch revisited. See

`Read the first ten pages of the "required reading on module 4 video 1 page.`

(70s) Thin Client. Mainframe was primary computing works for all aspecits.  
(80s - early 90s) Fat Client. Model was the PC revolution.  People doing business and production on PCs, not big mainframe computers.
(early 2000s) - html markup make browser Thin Client again, servers did all the work.
(modern) - browsers becoming Fat Client since they do so much work, and servers moved to cloud-computing, api-driven.

Think of single page applications as "desktop coding model"

### Video 2: JS and the DOM

The value inside of a node when looking at the DOM is called the content-model.

The DOM is everything going on inside the browser, but the browser itself has its own object model called `window`.

`Look at the required tutorial on w3schools <https://www.w3schools.com/js/js_htmldom.asp>`

### Video 5-6: CSS and Responsive Web Design (RWD)

CSS rendering cycle can be computationally expensive for RWD.  @media ... example
Adaptive rendering creates a bunch of fixed templates at different sizes and applies whichever may best fit the screen.

[Back to Top](#Vocab-from-Videos)
