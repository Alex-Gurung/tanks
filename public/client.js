var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendData = function(data) {
    Client.socket.emit('coords', data)
}

Client.sendUpdate = function(data) {
    Client.socket.emit('user update', data)
}

Client.socket.on('user update', function(data) {
    Game.updateMovement(data.id, data.key)
})

Client.socket.on('newplayer',function(player){
    Game.addNewPlayer(player.id,player.x,player.y, player.angle);
});

Client.socket.on('currentplayers',function(players){
    Game.resetPlayers();
    // console.log(players);
    for(var i = 0; i < players.length; i++){
        Game.addNewPlayer(players[i].id,players[i].x,players[i].y, players[i].angle);
    }
});
Client.socket.on('update user', function(user) {
    Game.updatePlayer(user.id, user.x, user.y, user.angle)
})
Client.socket.on('player locations', function(coord_data) {
    Game.resetPlayers();
})


Client.socket.on('make new flag', function() {
    console.log('make new flag')
    Game.makeFlagCoords();
})

Client.sendCoords = function(x, y) {
    Client.socket.emit('flag coords', {x: x, y: y})
}

Client.socket.on('render flag', function(data) {
    Game.renderFlag(data);
})
