
exports.init = function (io, app) {
    io.on('connection', function (socket) {
        socket.on('joining',function(userId,roomId){
            console.log('connected');
            //socket.join(room);
            socket.emit('updatechat',userId + ' has joined this room', roomId);});
        socket.on('disconnect', function () {
            console.log('disconnect');
        });
        socket.on('sendchat', function (data) {
            io.sockets.emit('updatechat',"123",data);
        });
    });
};

