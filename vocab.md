# Vocab from Videos

## Module 2 Vocab

HTTP attributes:
`Synchronous`: Each request has a corresponding response. Requester will block until response is received.
`Asynchronous`: We send a request and continue program execution.  Does not block waiting for the response.
`Stateless`: The response of the current request DOESS NOT depend on responses to previous requests.
`Stateful`: The response of the current request WILL depend on responses to previous requests.
`Connection-Oriented`: Property of a network socket lifecycle.  

- `Connectionless`: HTTP handles request and then immediately closes connection after response is done.
- `Connection-Oriented`: Requester has to initiate disconnected, otherwise connection will stay open.
`Impedence Mismatch`: Writing _stateful_ programs that are transmitted over _stateless_ HTTP.  We have to fake the statelessness in our application.

HTTP Methods:
`GET`: Makes request to resourse.  Meant to be a query; shouldn't change state.
`POST`: Used to pass input to server.

- GET encodes url, POST puts it in the body of the message.
- POST handles binary payloads, makes them invisible, and can support input requests of an arbitrary length (w/ Content-Length).
- Other options: OPTIONS, PUT, DELETE, CONNECT, TRACE, PATCH
