const Koa = require('koa')
const serve = require('koa-static')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io').Server
const { connect } = require('http2')

const sockets = {}
const sokcetMap = {}
const historys = []

const app = new Koa()
const server = http.createServer(app.callback())
const io = new socketIO(server)

io.on('clientMessage', (data) => {
    console.log('data')
})

io.on('disconnect', (socket) => {
    console.log('disconnect')
    sokcetMap[socket.handshake.query.name] = undefined
})

io.use((socket, next) => {
    console.log('a client incoming');
    const name = socket.handshake.query.username;
    const password = socket.handshake.query.psw;
    if (!name) {
        console.log('拒绝连接：没有账户名');
        next(new Error('empty'));
        return;
    }
    if (password != '123ewq') {
        console.log('拒绝连接：密码错误');
        next(new Error('error password'));
        return;
    }
    next();
})

io.on('connection', (socket) => {
    console.log('a user connected');
    const name = socket.handshake.query.username;
    sockets[name] = socket;
    socket.on('sendMessage', (content) => {
        console.log('receive a message', name, content);
        const message = {
            time: Date.now(),
            sender: name,
            content
        };
        historys.push(message);
        socket.broadcast.emit('receiveMessage', message);
    });

    socket.on('getHistory', (fn) => {
        fn(historys);
    })

    socket.on('disconnect', (reason) => {
        delete sockets[name];
        console.log('a user disconnect', name, reason);
        io.sockets.emit('online', Object.keys(sockets));
    })

    io.sockets.emit('online', Object.keys(sockets));
})

app.use(serve(path.join(__dirname, 'web')))

server.listen(3000, 'localhost', () => {
    console.log(`server running at: 3000`)
})


// const Koa = require('koa')
// const serve = require('koa-static')
// const http = require('http')
// const path = require('path')
// const SocketIo = require('socket.io').Server

// const hostname = '127.0.0.1'
// const port = 3000

// // 创建koa实例对象
// const app = new Koa()

// // 创建server实例对象
// const server = http.createServer(app.callback())

// // 创建socketIo实例
// const io = new SocketIo(server)

// io.on('connect', (socket) => {
//     console.log('connect')
//     setInterval(() => {
//         socket.emit('message', new Date());
//     }, 1000)
// })

// io.on('disconnect', () => {
//     console.log('disconnect')
// })

// // koa-static是koa的静态资源中间件
// // 当有多个静态资源文件夹的话，就写多个下行代码
// app.use(serve(path.join(__dirname, 'web')))

// app.listen(port, hostname, () => {
//     console.log(`Server is running at http://${hostname}:${port}`)
// })


// // ctx是上下文对象
// // ctx.request 是Koa Request对象
// // ctx.response 是Koa Response对象
// // app.use(async(ctx, next) => {
// //     console.log("1")
// //     await next() // 遇到await就转去执行下一个中间件app.use,执行完之后再来执行后续代码
// //     console.log("3")
// // })

// // app.use(ctx => {
// //     console.log("2")
// //     ctx.body = "hello,电子科大"
// // })

// // app.listen(3000)