let loginBtn = document.getElementById('loginBtn');
let username = document.getElementById('userName');
let password = document.getElementById('password');
let inputWrap = document.getElementById("input");
let msgButton = document.getElementById("msg-button");
let readHistory = document.getElementById("history-msg");
let socket;

loginBtn.addEventListener('click', loginCheck);
msgButton.addEventListener("click", sendMsg);
inputWrap.addEventListener("keydown", debounce(handleEnter));
readHistory.addEventListener('click', readHistorys);

// 登录检查
function loginCheck() {
    let userName = username.value;
    let psw = password.value;
    let chartRoomWrap = document.getElementById('chartRoom');
    let loginWrap = document.getElementById('login');

    socket = io({
        query: {
            username: userName,
            psw: psw
        },
        reconnection: false
    })
    socket.on('connect', () => {
        chartRoomWrap.setAttribute('style', 'display:block;');
        loginWrap.setAttribute('style', 'display:none;');

        socket.on('receiveMessage', (message) => {
            let msgWrap = document.getElementById("msg-wrap-item");
            let msgDiv = document.createElement("div");
            msgDiv.className = "msg-list";
            let img = document.createElement("img");
            img.src = "https://cdn.jsdelivr.net/gh/doublesweet01/BS_script@master/image/sweet.jpg"
            let firstDiv = document.createElement("div");
            let nameDiv = document.createElement("div");
            nameDiv.className = "friends-name";
            nameDiv.innerHTML = message.sender;
            let textDiv = document.createElement("div");
            textDiv.className = "other-context";
            textDiv.innerHTML = message.content;
            firstDiv.appendChild(nameDiv);
            firstDiv.appendChild(textDiv);
            msgDiv.appendChild(img);
            msgDiv.appendChild(firstDiv);
            msgWrap.appendChild(msgDiv);

            let chartWrap = document.getElementById("msg-wrap");
            chartWrap.scroll({
                top: chartWrap.scrollHeight,
                left: 0,
                behavior: "smooth"
            })
        })

        socket.on('online', (onlines) => {
            console.log('onlines', onlines);
            const firendList = document.getElementById('friends-list');
            firendList.innerHTML = onlines.map(name => {
                return `<div class="friends-item">${name}</div>\n`;
            }).join('');
        });
    })

    socket.on('connect_error', (e) => {
        console.log('connect_error', e.name);
        if (e && e.message === 'error password') {
            alert('密码错误');
            return;
        }
        alert('连接失败，请检查服务器地址');
    })
}

// 发送消息
function sendMsg() {
    let sendMsg = document.getElementById("input").value;
    let userName = username.value;
    if (!sendMsg) {
        alert("请输入文字内容！");
        return;
    }

    let msgWrap = document.getElementById("msg-wrap-item");
    let msgDiv = document.createElement("div");
    msgDiv.className = "msg-list msg-list-right";
    let img = document.createElement("img");
    img.src = "https://cdn.jsdelivr.net/gh/doublesweet01/BS_script@master/image/sweet.jpg"
    let firstDiv = document.createElement("div");
    let nameDiv = document.createElement("div");
    nameDiv.className = "my-name";
    nameDiv.innerHTML = userName;
    let textDiv = document.createElement("div");
    textDiv.className = "my-context";
    textDiv.innerHTML = sendMsg;
    firstDiv.appendChild(nameDiv);
    firstDiv.appendChild(textDiv);
    msgDiv.appendChild(img);
    msgDiv.appendChild(firstDiv);
    msgWrap.appendChild(msgDiv);

    // 输入框置空
    document.getElementById("input").value = "";
    socket.emit('sendMessage', sendMsg);

    let chartWrap = document.getElementById("msg-wrap");
    chartWrap.scroll({
        top: chartWrap.scrollHeight,
        left: 0,
        behavior: "smooth"
    })
}

// 查看历史记录
function readHistorys() {
    socket.emit('getHistory', (data) => {
        let userName = username.value;
        console.log('history', data);
        let msgWrap = document.getElementById("msg-wrap-item");
        msgWrap.innerHTML = data.map((value) => {
            if (value.sender == userName) {
                return (
                    `<div class="msg-list msg-list-right">
                <img src="https://cdn.jsdelivr.net/gh/doublesweet01/BS_script@master/image/sweet.jpg">
                <div>
                    <div class="my-name">${value.sender}</div>
                    <div class="my-context">${value.content}</div>
                </div>
                </div>\n`
                );
            }
            return (
                `<div class="msg-list">
                <img src="https://cdn.jsdelivr.net/gh/doublesweet01/BS_script@master/image/sweet.jpg">
                <div>
                    <div class="friends-name">${value.sender}</div>
                    <div class="other-context">${value.content}</div>
                </div>
            </div>\n`
            );
        }).join('');
    });
    // 隐藏查看消息的div
    readHistory.setAttribute('style', 'display:none;');
}

// 监听键盘按下
function debounce(fn) {
    let timeout = null;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.call(this, arguments);
        }, 200);
    }
}

// 处理键盘按下
function handleEnter(args) {
    let e = args[0];
    if (e.keyCode === 13) {
        sendMsg();
    }
}