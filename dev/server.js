const http = require('http');
const fs = require('fs');
const path = require('path');

process.on('uncaughtException', err => console.error('uncaught exception', err));
process.on('unhandledRejection', err => console.error('unhandled rejection', err));

const publicFolder = process.argv.length > 2 ? process.argv[2] : '.';
const port = process.argv.length > 3 ? process.argv[3] : 8080;

const mediaTypes = {
  png: 'image/png',
  svg: 'image/svg+xml',
  html: 'text/html',
  css: 'text/css',
};

const server = http.createServer(function(request, response) {
  console.log(request.method + ' ' + request.url);
  let file = request.url;
  let ext = path.extname(file);

  // Default to an .html file if no extension is provided in the url
  // (To simulate what happens in production)
  if(ext.length === 0) {
    ext = '.html';
    file = file + ext;
  }
  const filepath = path.join(publicFolder, file);

  fs.readFile(filepath, function(err, data) {
    if(err) {
      response.statusCode = 404;
      return response.end('Not found');
    }

    let mediaType = 'text/html';
    if(ext.length > 0 && mediaTypes.hasOwnProperty(ext.slice(1))) {
      mediaType = mediaTypes[ext.slice(1)];
    }

    response.setHeader('Content-Type', mediaType);
    response.end(data);
  })
})

server.on('clientError', function onClientError(err, socket) {
  console.log('clientError', err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
})

server.listen(port, '127.0.0.1', function() {
  console.log('Started dev server on port: ' + port);
})
