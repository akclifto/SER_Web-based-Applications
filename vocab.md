# Vocab from Videos

## Module 2 Vocab

### HTTP attributes

`Synchronous`: Each request has a corresponding response. Requester will block until response is received.
`Asynchronous`: We send a request and continue program execution.  Does not block waiting for the response.
`Stateless`: The response of the current request DOES NOT depend on responses to previous requests.
`Stateful`: The response of the current request WILL depend on responses to previous requests.
`Connection-Oriented`: Property of a network socket lifecycle.  

- `Connectionless`: HTTP handles request and then immediately closes connection after response is done.
- `Connection-Oriented`: Requester has to initiate disconnected, otherwise connection will stay open.
`Impedence Mismatch`: Writing _stateful_ programs that are transmitted over _stateless_ HTTP.  We have to fake the statelessness in our application.

### HTTP Methods

`GET`: Makes request to resourse.  Meant to be a query; shouldn't change state.  
`POST`: Used to pass input to server.

- GET encodes url, POST puts it in the body of the message.
- POST handles binary payloads, makes them invisible, and can support input requests of an arbitrary length (w/ Content-Length).
- Other options: OPTIONS, PUT, DELETE, CONNECT, TRACE, PATCH

### Cookies

Server sends a simple name : value pair to client.  When client comes back to site, cookie gets sent to server indicating a returning user. Client doesn't have to accept cookies; a lot of privacy-focused browsers block 3rd-party cookies by default, and have option to block all cookies.
Dynamic webpages require cookies to function.  _Privacy concerns_.  Cookies can have expiration dates ranging from whenever the user session ends (the one-time stop on a website), to a few hours to decades!

Typical uses:

- ID user during e-commerce session
- Avoiding username and password.  (bad!) don't do this
- site personalization or customization
- focused advertizing

Types:

- Session: session browser instance only
- Persistent: time period specific
- Secure: only transmitted over HTTPS by indicating `secure flag`, helps against snooping or cookie stealing
- HttpOnly: Prevents reading cookie values in JS by using `HttpOnly flag`, avoid malicious JS that compromise cookie info.

## Module 3 Vocab

### Video 1: ServerState18

Different types of State:

- Application state:  the lifecycle of your application process itself
- User preferences state: understanding who the user is, what they want to do, and how they want to interact with the web app.
- World State: info independent of a specific program
- conversational state: the topic of the first video, below:

`Conversational State`: represents a bounded "conversation" or interaction beteween a client and server.

Conversation state management, ranked from worst to best:

- hidden values on Forms: easy to break or steal.
- URL rewriting: better than hidden forms, but has same problems
- Cookies: can persist beyound session intentions
- SSL: Best, but pain from UX and computational scalability standpoint.
- Session-oriented middleware:  topic for another time, but is the direction web apps are going.

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

- Data access:  how we access data and where's it stored
- business logic: organization value. independent of specific apps (domain/model objects used to handle all types of clients)
- presentation: rendering stuff to user.  what tech uses and whos responsible for it.

You don't want these to change too much based on the others.  Data access should not affect business logic and rendering should not affect data access and so on.

`MVC pattern steps with node/express`, different from req/res process steps:

- 1: Front controller: map url and other info. App specific.
- 2: process parameters of request.
- 3: Route match to controller, interact with biz logic and data in model objects. (db, etc.)
- 4: When processing complete, goes back to controller to select and apply the view (template pattern).
- 5: Set res headers in view template.
- 6: write out the content (HTML).

`MVC`:

- View: presentation:  projection, what is the content type returned and what content to end user.
  - view can NEVER modify the model.
- Model: comes from the datasources (world model like dbs). App independent, reusable.
- Controller: routes requests (is NOT the biz logic).  It's really the appl logic. App specific.

`Implementing MVC`:

1. HTTP request made to router/controller
2. Controller (routes or delegates) to the Model
3. The model executes the business logic on the world model (non-volatile state, typically a datasource).
4. The controller iIDs the appropriate View template.
5. The view (read-only) accesses the model to ge tthe dynamic output.
6. The view produces the final rendered response to the client browser.

### Video 2: Node MVC with Express - Using Express

```javascript
app.get('/', function (req, res) { //route 1, binds path to callback
    let response = <html> ... </html>
    res.status(200);
    res.set({'content-type': 'text/html', 
            'content-length': resposne.length
    });
    res.send(response);
    // logs
});

app.get('/error', function (req, res) { //route 2
    res.status(400);
    res.send("This is a bad request");
});

```

`app.get('/')` is called a route.
