const http = require('http');
const url = require('url');
const handlers = require('./handlers/index');
const port = 3333;

http
  .createServer((req, res) => {
    req.path = url.parse(req.url).pathname
    for (let handler of handlers){
      let result = handler(req, res)
      if (!result) {
        break;
      }
    }
  })
  .listen(port);

console.log(`Server is listening to port ${port}`);
