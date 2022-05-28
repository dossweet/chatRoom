const http = require('http');
const fs = require('fs');
const queryString = require('querystring');

const hostName = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    let pathName = req.url;
    if (pathName === '/') {
        fs.readFile('./view/index.html', 'utf-8', (err, data) => {
            if (err) {
                return console.log(err);
            }
            res.end(data);
        })
    } else if (path.endsWith('.html')) {

    } else if (path.startsWith('/api')) {
        let apiName = pathName.slice(5);
        let body = '';
        req.on('data', function(chunk) {
            body += chunk;
        })
        req.on('end', function() {
            body = queryString.parse(body);

        })
    }
});

server.listen(port, hostName, () => {
    console.log(`server is running at ${hostName}:${port}`);
})