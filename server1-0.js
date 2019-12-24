const http = require('http');

const server = http.createServer((req,res) => {
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
});
server.listen(8080);