const http = require('http')
const path = require('path')
const fs = require('fs')

const hostName = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
    // const url = req.url;
    // const query = url.split('?')[1]
    // console.log(query)
    const fileName = path.basename(req.url)
    const filePath = path.join(__dirname, 'web', fileName) //web表示web文件夹
    const isCss = fileName.includes('css')
    console.log(fileName, filePath)

    res.statusCode = 200;
    res.setHeader('Content-type', `text/${ !isCss?'html':'css'}; charset = utf - 8`)
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            res.end(data + '\n')
        })
    } else {
        res.end('not found\n')
    }
})

server.listen(port, hostName, () => {
    console.log(`server is running at ${hostName}:${port}`)
})