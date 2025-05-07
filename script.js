let WIDTH = 800;
let HEIGHT = 600;

const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let ball;
let ballSize = 80;
let yspeed = 0.5;
let xspeed = 1.0;
let lives = 10; // Initialize lives to 10
let livesText; // Variable to hold the text object
let gameOverText; // Variable to hold the "Game Over" text object

function preload() {
    this.load.image("ball", "assets/ball.png"); // watch out for case sensitivity
}

function create() {
    ball = this.add.sprite(WIDTH / 2, HEIGHT / 2, "ball"); // x, y, and the ball "key"
    ball.setDisplaySize(ballSize, ballSize); // width, height

    // Add a pointerdown event listener to the ball
    ball.setInteractive();
    ball.on('pointerdown', () => {
        if (lives > 0) {
            // Reduce the ball size by 10%
            ballSize *= 0.9;
            ball.setDisplaySize(ballSize, ballSize);

            // Increase the speed by 10%
            xspeed *= 1.1;
            yspeed *= 1.1;

            // Increase lives by 1
            lives++;
            livesText.setText(`Lives: ${lives}`); // Update the text display
        }
    });

    // Add text to display the number of lives
    livesText = this.add.text(10, 10, `Lives: ${lives}`, {
        font: "20px Arial",
        fill: "#ffffff"
    });

    // Add a placeholder for the "Game Over" text (hidden initially)
    gameOverText = this.add.text(WIDTH / 2, HEIGHT / 2, "Game Over", {
        font: "40px Arial",
        fill: "#ff0000"
    });
    gameOverText.setOrigin(0.5); // Center the text
    gameOverText.setVisible(false); // Hide it initially
}

function update() {
    if (lives <= 0) {
        // Stop the ball's movement
        xspeed = 0;
        yspeed = 0;

        // Show the "Game Over" text
        gameOverText.setVisible(true);
        return; // Exit the update loop
    }

    ball.y += yspeed;
    ball.x += xspeed;

    // Check for collision with top or bottom walls
    if (ball.y >= HEIGHT - ballSize / 2 || ball.y <= ballSize / 2) {
        yspeed *= -1; // Reverse direction
        lives--; // Decrease lives by 1
        livesText.setText(`Lives: ${lives}`); // Update the text display
    }

    // Check for collision with left or right walls
    if (ball.x >= WIDTH - ballSize / 2 || ball.x <= ballSize / 2) {
        xspeed *= -1; // Reverse direction
        lives--; // Decrease lives by 1
        livesText.setText(`Lives: ${lives}`); // Update the text display
    }
}































