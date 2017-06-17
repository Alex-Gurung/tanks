var Game = {};
Game.playerMap = {};
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
var currentSpeed = 0;
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
            tank.angle -= 4;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            tank.angle += 4;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            //  The speed we'll travel at
            currentSpeed = 300;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            //  The speed we'll travel at
            currentSpeed = -300;
            //tank.angle+=180;
        } else {
            if (currentSpeed > 0) {
                currentSpeed -= 4;
            }
            if (currentSpeed < 0) {
                currentSpeed += 4;
            }
        }

        if (currentSpeed > 0 || currentSpeed < 0)
        {
            game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
        }

        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;
        // console.log("x&y")
        // console.log(tank.x)
        // console.log(tank.y)
        Client.sendData({x: tank.x, y: tank.y, angle: tank.angle});
    }
}
Game.resetPlayers = function () {
    // Object.keys(Game.playerMap).forEach(function(sprite_id) {
    //     var sprite = Game.playerMap[sprite_id]
    //     console.log(sprite)
    //     sprite.destroy();
    // })
    Game.playerMap = {};
}
Game.addNewPlayer = function (id, x, y, angle) {
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
    // Game.playerMap[id].angle = angle;
};
Game.updatePlayer = function(id, x, y, angle) {
    if (Game.playerMap[id]){
        Game.playerMap[id].destroy()
    }
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
    Game.playerMap[id].angle = angle;
}

game.state.add('Game', Game);
game.state.start('Game');