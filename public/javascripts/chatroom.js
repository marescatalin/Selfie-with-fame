var socket = io();

function sendText() {
    var input = document.getElementById('text');
    var text = input.value;
    if (text == '')
        return false;
    socket.emit('sendchat',text);
    input.value = '';
    return false;
}

socket.on('updatechat', function (who,text){
    var div1 = document.getElementById('chat');
    var div2 = document.createElement('messages');
    var div3 = document.createElement('div');
    div2.innerHTML = who+': '+text;
    div3.innerHTML = '<br>'+'<br>';
    div1.appendChild(div3);
    div1.appendChild(div2);
});

socket.on('joinroom', function (who){
    var div1 = document.getElementById('chat');
    var div2 = document.createElement('messages');
    var div3 = document.createElement('div');
    div3.innerHTML = '<br>';
    div2.innerHTML = who;
    div1.appendChild(div3);
    div1.appendChild(div2);
});

document.addEventListener('DOMContentLoaded', function(event) {
    let username = getCookie("session");
    if(username === "") {
        username = getCookie('permanentSession')
    }
    socket.emit('joining',username);
    socket.emit('create', 'event');
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}