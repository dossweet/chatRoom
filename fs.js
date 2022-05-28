const fs = require('fs')

const data1 = fs.readFileSync('./text.txt', 'utf-8')
console.log(data1)
console.log("running eventloop")

fs.readFile('./text.txt', { encoding: 'utf-8' }, (err, data) => {
    console.log('read file by async:', data)
})

console.log("running eventloop")