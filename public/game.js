var Game = {};
Game.playerMap = {};
Game.speedMap = {};
var game = new Phaser.Game(800, 600, Phaser.AUTO, document.getElementById('game'));



Game.init = function () {
    game.stage.disableVisibilityChange = true;
}

Game.preload = function () {
    // game.load.tilemap('map', 'tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('sprite', 'tank.png');
    game.load.image('tile', 'tile.png')
}
var land;
var cursors;
// var currentSpeed = 0;
Game.create = function () {
    // var map = game.add.tilemap('map')
    game.world.setBounds(-1000, -1000, 2000, 2000);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    land = game.add.tileSprite(0, 0, 800, 600, 'tile');
    land.fixedToCamera = true;
    game.stage.backgroundColor = '#7a7a7a';
    cursors = game.input.keyboard.createCursorKeys();

    Client.askNewPlayer();
}
Game.update = function () {
    // land.tilePosition.x += 2;
    var tank = Game.playerMap[Client.socket.io.engine.id];
    var currentSpeed = Game.speedMap[Client.socket.io.engine.id];
    if (tank) {
        game.camera.follow(tank);
        // console.log('ta')
        // console.log(tank)
        // console.log('nk')
        // console.log(Phaser.Physics.ARCADE)
        game.physics.arcade.enable([tank]);

        tank.body.drag.set(10);
        tank.body.maxVelocity.setTo(400, 400);
        tank.body.collideWorldBounds = true;
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            Client.sendUpdate({id: Client.socket.io.engine.id, key: "A"})
            tank.angle -= 4;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            Client.sendUpdate({id: Client.socket.io.engine.id, key: "D"})
            tank.angle += 4;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            Client.sendUpdate({id: Client.socket.io.engine.id, key: "W"})
            //  The speed we'll travel at
            currentSpeed = 300;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            Client.sendUpdate({id: Client.socket.io.engine.id, key: "S"})
            //  The speed we'll travel at
            currentSpeed = -300;
            //tank.angle+=180;
        } else {
            // if (currentSpeed > 0) {
            //     currentSpeed -= 10;
            // }
            // if (currentSpeed < 0) {
            //     currentSpeed += 10;
            // }
            // currentSpeed = 0;   
        }

        if (!game.input.keyboard.isDown(Phaser.Keyboard.W) && !game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            currentSpeed = 0;
            Client.sendUpdate({id: Client.socket.io.engine.id, key: "noforback"})
            //tank.angle+=180;
        }

        // if (currentSpeed > 0 || currentSpeed < 0)
        // {
            game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
        // }
        // Object.keys(Game.playerMap).forEach(function(sprite_id) {
        //     if (sprite_id !== Client.socket.io.engine.id){
        //     var sprite = Game.playerMap[sprite_id]
        //     game.physics.arcade.velocityFromRotation(tank.rotation, 0, tank.body.velocity);
        //     }
        //     // console.log(sprite)
        //     // sprite.destroy();
        // })
        Game.speedMap[Client.socket.io.engine.id] = currentSpeed;
        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;
        // console.log("x&y")
        // console.log(tank)
        // console.log(tank.y)
        // Client.sendData({x: tank.x, y: tank.y, angle: tank.angle});
    }
}

Game.updateMovement = function(id, key){
    var other_tank = Game.playerMap[id];
    var currentSpeed = Game.speedMap[id];
    // console.log(id)
    // console.log(currentSpeed)
    if (other_tank) {
        // game.camera.follow(other_tank);
        // console.log('ta')
        console.log(other_tank)
        // console.log('nk')
        // console.log(Phaser.Physics.ARCADE)
        game.physics.arcade.enable([other_tank]);

        // other_tank.body.drag.set(10);
        // other_tank.body.maxVelocity.setTo(400, 400);
        // other_tank.body.collideWorldBounds = true;

        if (key === "A") {
            other_tank.angle -= 4;
        } else if (key === "D") {
            other_tank.angle += 4;
        } else if (key === "W") {
            //  The speed we'll travel at
            currentSpeed = 300;
        } else if (key === "S") {
            //  The speed we'll travel at
            currentSpeed = -300;
            //other_tank.angle+=180;
        } else {
            // if (currentSpeed > 0) {
            //     currentSpeed -= 10;
            // }
            // if (currentSpeed < 0) {
            //     currentSpeed += 10;
            // }
            // currentSpeed = 0;
        }
        if (key === "noforback"){
            currentSpeed = 0;
        }
        // if (!key==="S" && !key==="W") {
        //     currentSpeed = 0;
        //     //tank.angle+=180;
        // }

        // if (currentSpeed > 0 || currentSpeed < 0)
        // {
            game.physics.arcade.velocityFromRotation(other_tank.rotation, currentSpeed, other_tank.body.velocity);
            // other_tank.x = 10;
            // other_tank.x += Math.cos(other_tank.angle)*currentSpeed
            // other_tank.y += Math.sin(other_tank.angle)*currentSpeed
        // }    
        Game.speedMap[id] = currentSpeed;

        // land.tilePosition.x = -game.camera.x;
        // land.tilePosition.y = -game.camera.y;
    }
}

Game.resetPlayers = function () {
    Object.keys(Game.playerMap).forEach(function(sprite_id) {
        var sprite = Game.playerMap[sprite_id]
        console.log(sprite)
        sprite.destroy();
    })
    Game.playerMap = {};
    Game.speedMap = {};
}
Game.addNewPlayer = function (id, x, y, angle) {
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
    Game.speedMap[id] = 0;
    // Game.playerMap[id].angle = angle;
};
Game.updatePlayer = function(id, x, y, angle) {
    if (Game.playerMap[id]){
        Game.playerMap[id].destroy()
    }
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
    // Game.playerMap[id].angle = angle;
    
}

game.state.add('Game', Game);
game.state.start('Game');