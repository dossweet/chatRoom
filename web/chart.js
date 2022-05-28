let msgButton = document.getElementById("msg-button");
msgButton.addEventListener("click", sendMsg);

function sendMsg() {
    let sendMsg = document.getElementById("input").value;
    if (!sendMsg) {
        alert("请输入文字内容！");
        return;
    }

    let msgWrap = document.getElementById("msg-wrap-item");
    let msgDiv = document.createElement("div");
    msgDiv.className = "msg-list";
    let img = document.createElement("img");
    img.src = "https://cdn.jsdelivr.net/gh/doublesweet01/BS_script@master/image/sweet.jpg"
    let textDiv = document.createElement("div");
    textDiv.innerHTML = sendMsg;
    msgDiv.appendChild(img);
    msgDiv.appendChild(textDiv);
    msgWrap.appendChild(msgDiv);

    socket.emit('sendMessage', msg);
}