
exports.init = function (io, app) {
    io.on('connection', function (socket) {
        socket.on('joining',function(user){
            console.log('connected');
            socket.emit('joinroom',user + ' has joined the room');
            socket.on('create', function (room) {
                socket.join(room);
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

