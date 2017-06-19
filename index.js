//https://web-2018bascoli-jaminben.c9users.io/
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http);

app.use(express.static('public'))

app.get("/", function(req, res){
    res.sendFile(__dirname + '/public/')
})

http.listen(process.env.PORT || 8080, function() {
    console.log('App listening on port' + process.env.PORT + '!')
})

var coord_data = {}
var flag_coord = {x: 0, y: 0}
io.on('connection', function(socket){
    if (Object.keys(io.sockets.connected).length == 1) {
        console.log('making new flag')
        socket.emit('make new flag')
    }
    else{
        socket.emit('render flag', flag_coord)
    }
  console.log('someone connected')
  socket.on('newplayer', function() {
      console.log('new player')
      socket.player = {
          id:socket.id,
          x: getRandomArbitrary(50, 750),
          y: getRandomArbitrary(50, 550),
          angle: 0
      }
    //   console.log("created player")
      socket.emit('currentplayers', getCurrentPlayers());
      socket.broadcast.emit('newplayer', socket.player)
  })

  socket.on('flag coords', function(data) {
      console.log('flag coords received ' + JSON.stringify(data))
      flag_coord.x = data.x
      flag_coord.y = data.y
      socket.emit('render flag', flag_coord)
      socket.broadcast.emit('render flag', flag_coord)
  })

  socket.on('user update', function(data) {
      socket.broadcast.emit('user update', data)
  })
  socket.on('coords', function(data) {
        //   console.log(io.sockets.connected[socket.id].player.x)
        socket.player = {
          id:socket.id,
          x: data.x,
          y: data.y,
          angle: data.angle
      }
    //   console.log(io.sockets.connected[socket.id].player.x)
    //   socket.emit('coords', getCurrentPlayers());
      socket.broadcast.emit('update user', socket.player);
    //   if (Object.keys(coord_data).length == Object.keys(io.sockets.connected).length){
    //       coord_data = {}
    //   }
    //   var x = data.x;
    //   var y = data.y;
    //   var id = socket.id;
    //   coord_data[id] = [x, y]
    //   if (Object.keys(coord_data).length == Object.keys(io.sockets.connected).length){
    //       socket.emit('player locations', coord_data)
    //       socket.broadcast.emit('player locations', coord_data)
    //   }

  })
//   socket.on('event', function(data){});
  socket.on('disconnect', function(){
      console.log('disconnect')
      socket.emit('currentplayers', getCurrentPlayers());
      socket.broadcast.emit('currentplayers', getCurrentPlayers());
  });
});

function getCurrentPlayers() {
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player){
            players.push(player)
        };
    });
    return players;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}