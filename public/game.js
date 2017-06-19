var Game = {};
Game.playerMap = {};
Game.turretMap = {};
Game.speedMap = {};
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, document.getElementById('game'));



Game.init = function () {
    game.stage.disableVisibilityChange = true;
}

Game.preload = function () {
    // game.load.tilemap('map', 'tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('sprite', 'tank.png');
    game.load.image('tile', 'tile.png')
    game.load.image('bullet', 'bullet.png');
    game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
    game.load.atlas('enemy', 'assets/enemy-tanks.png', 'assets/tanks.json');
    game.load.image('logo', 'assets/logo.png');
    // game.load.image('bullet', 'assets/made/bullet.png');
    game.load.image('earth', 'assets/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
    game.load.image('turret', 'assets/turret.png')
}
var land;
var cursors;
// var currentSpeed = 0;
Game.create = function () {
    // var map = game.add.tilemap('map')
    game.world.setBounds(-1000, -1000, 2000, 2000);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    land = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'tile'); //width, height -> 800, 600
    land.fixedToCamera = true;
    game.stage.backgroundColor = '#7a7a7a';
    cursors = game.input.keyboard.createCursorKeys();
    
    // game.debug.text('Enemies: ' + 1 + ' / ' + 2, 32, 32);

    Client.askNewPlayer();
}
Game.update = function () {
    // land.tilePosition.x += 2;
    var tank = Game.playerMap[Client.socket.io.engine.id];
    var turret = Game.turretMap[Client.socket.io.engine.id];
    var currentSpeed = Game.speedMap[Client.socket.io.engine.id];
    if (tank) {
    //     tank.anchor.setTo(0.5, 0.5);
    //     tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
    //     turret = game.add.sprite(0, 0, 'tank', 'turret');
    //     turret.anchor.setTo(0.3, 0.5);

    //     tank.bringToTop();
    // turret.bringToTop();


    // tank.anchor.setTo(0.5, 0.5);
    // tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    //  This will force it to decelerate and limit its speed
    // game.physics.enable(tank, Phaser.Physics.ARCADE);
    // tank.body.drag.set(0.2);
    // tank.body.maxVelocity.setTo(400, 400);
    // tank.body.collideWorldBounds = true;
    

    //  Finally the turret that we place on-top of the tank body
    // turret = game.add.sprite(0, 0, 'tank', 'turret');
    // turret.anchor.setTo(0.3, 0.5);
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
        if (game.input.keyboard.isDown(Phaser.Keyboard.M))
    {
        Client.sendUpdate({id: Client.socket.io.engine.id, key: "M"})
        turret.rotation+=.1;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.N))
    {
        Client.sendUpdate({id: Client.socket.io.engine.id, key: "N"})
        turret.rotation-=.1;
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
        turret.x = tank.x;
        turret.y = tank.y;
        // console.log("x&y")
        // console.log(tank)
        // console.log(tank.y)
        // Client.sendData({x: tank.x, y: tank.y, angle: tank.angle});
    }
}

Game.showScores = function() {
    game.debug.text('Enemies: ' + 1 + ' / ' + 2, 32, 32);
}

Game.updateMovement = function(id, key){
    var other_tank = Game.playerMap[id];
    var other_turret = Game.turretMap[id];
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
        if (key === "M")
    {
        other_turret.rotation+=.1;
    }
    else if (key === "N")
    {
        other_turret.rotation-=.1;
    }
        // if (!key==="S" && !key==="W") {
        //     currentSpeed = 0;
        //     //tank.angle+=180;
        // }
        other_turret.x = other_tank.x;
        other_turret.y = other_tank.y;
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
        var turr = Game.turretMap[sprite_id]
        turr.destroy();
    })
    Game.playerMap = {};
    Game.turretMap = {};
    Game.speedMap = {};
}
Game.addNewPlayer = function (id, x, y, angle) {
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
    Game.turretMap[id] = game.add.sprite(x, y, 'tank', 'turret');
    Game.playerMap[id].anchor.setTo(0.5, 0.5);
    Game.turretMap[id].anchor.setTo(0.3, 0.5);
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