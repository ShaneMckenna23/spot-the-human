var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('backdrop', 'assets/backdrop.png');
    game.load.image('ball', 'assets/ball.png');
}

var card;
var cursors;

function create() {

    game.world.setBounds(0, 0, 800, 600);

    game.add.sprite(0, 0, 'backdrop');

    card = game.add.sprite(64, 64, 'ball');

    game.camera.follow(card);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
        card.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        card.x += 4;
    }

    if (cursors.up.isDown)
    {
        card.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        card.y += 4;
    }

    game.world.wrap(card, 0, true);

}

function render() {

    game.debug.cameraInfo(game.camera, 500, 32);
    game.debug.spriteCoords(card, 32, 32);

}