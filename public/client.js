var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendData = function(data) {
    Client.socket.emit('coords', data)
}

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