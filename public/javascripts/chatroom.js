var socket = io();

function sendText() {
    var input = document.getElementById('text');
    var text = input.value;
    console.log("send",text);
    if (text == '')
        return false;
    socket.emit('sendchat',text);
    input.value = '';
    return false;
}

socket.on('updatechat', function (who,text){
    var div1 = document.getElementById('chat');
    var div2 = document.createElement('div');
    div1.appendChild(div2);
    div2.innerHTML = '<br/>'+who+': '+text;
});

document.addEventListener('DOMContentLoaded', function(event) {
    socket.emit('joining',"1234","123");
});