
exports.init = function (io, app) {
    io.on('connection', function (socket) {
        socket.on('joining',function(user,roomId){
            console.log('connected');
            socket.emit('updatechat',user + ' has joined this room', roomId);
            socket.on('create', function (room) {
                socket.join(room);
                console.log(socket);
                socket.on('sendchat', function (data) {
                    io.sockets.in(room).emit('updatechat',user,data);
                });
            });

        });
        socket.on('disconnect', function () {
            console.log('disconnect');
        });
    });
};

