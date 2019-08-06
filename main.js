const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((request, response) => {
    let url = require('url').parse(request.url);
    if (url.pathname.length == 0 || url.pathname === '/') {
        url.pathname = "/index.html";
    }
    if (url.pathname === '/test') {
        response.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
        response.write(request.method + ' ' + request.url + ' HTTP/' + request.httpVersion + '\r\n');
        for (const h in request.headers) {
            if (request.headers.hasOwnProperty(h)) {
                const element = request.headers[h];
                response.write(h + ': ' + element + '\r\n');
            }
        }
        response.write('\r\n');
        response.end();
    } else {
        let filename = url.pathname.substring(1);
        let type;
        switch (filename.substring(filename.lastIndexOf('.') + 1)) {
            case 'html':
            case 'htm':      type ='text/html; charset=UTF-8'; break;
            case 'js':       type = 'application/javascript; charset=UTF-8'; break;
            case 'css':      type = 'text/css; charset=UTF-8;'; break;
            case 'txt':      type = 'text/plain; charset=UTF-8;'; break;
            case 'manifest': type = 'text/cache-manifest; charset=UTF-8'; break;
            default:         type = 'application/octet-stream'; break;
        }
        fs.readFile(filename, function (err, content) {
            if (err) {
                response.writeHead(404, {'Content-Type': 'text/plain; charset=UTF-8'});
                response.write(err.message);
                response.end();
            } else {
                response.writeHead(200, {'Content-Type': type});
                response.write(content);
                response.end();
            }
        });
    }
});

server.listen(80);
