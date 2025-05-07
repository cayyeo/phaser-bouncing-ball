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

let balls = []; // Array to hold all balls
let ballSize = 80;
let lives = 10; // Initialize lives to 10
let livesText; // Variable to hold the text object
let gameOverText; // Variable to hold the "Game Over" text object

function preload() {
    this.load.image("ball", "assets/ball.png"); // watch out for case sensitivity
}

function create() {
    // Create the main ball
    createBall(this, WIDTH / 2, HEIGHT / 2, ballSize, 1.0, 0.5, true); // Main ball decreases lives

    // Create 50 balls that decrease lives when touching walls
    for (let i = 0; i < 50; i++) {
        let x = Phaser.Math.Between(ballSize / 2, WIDTH - ballSize / 2);
        let y = Phaser.Math.Between(ballSize / 2, HEIGHT - ballSize / 2);
        let xspeed = Phaser.Math.FloatBetween(-2, 2);
        let yspeed = Phaser.Math.FloatBetween(-2, 2);
        createBall(this, x, y, ballSize, xspeed, yspeed, true); // Pass `true` for balls that decrease lives
    }

    // Create 50 balls that increase lives when touching walls
    for (let i = 0; i < 50; i++) {
        let x = Phaser.Math.Between(ballSize / 2, WIDTH - ballSize / 2);
        let y = Phaser.Math.Between(ballSize / 2, HEIGHT - ballSize / 2);
        let xspeed = Phaser.Math.FloatBetween(-2, 2);
        let yspeed = Phaser.Math.FloatBetween(-2, 2);
        createBall(this, x, y, ballSize, xspeed, yspeed, false); // Pass `false` for balls that increase lives
    }

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

function createBall(scene, x, y, size, xspeed, yspeed, givesLife) {
    let ball = {
        sprite: scene.add.sprite(x, y, "ball"),
        size: size,
        xspeed: xspeed,
        yspeed: yspeed,
        givesLife: givesLife // Add a property to indicate if the ball gives lives
    };
    ball.sprite.setDisplaySize(size, size);
    ball.sprite.setInteractive();

    // Add a pointerdown event listener to the ball
    ball.sprite.on('pointerdown', () => {
        if (lives > 0) {
            if (ball.givesLife) {
                // Increase lives by 1 if the ball gives lives
                lives++;
            } else {
                // Reduce the ball size by 10% for normal balls
                ball.size *= 0.9;
                ball.sprite.setDisplaySize(ball.size, ball.size);

                // Increase the speed by 10%
                ball.xspeed *= 1.1;
                ball.yspeed *= 1.1;
            }
            livesText.setText(`Lives: ${lives}`); // Update the text display
        }
    });

    balls.push(ball); // Add the ball to the array
}

function update() {
    if (lives <= 0) {
        // Stop all balls' movement
        balls.forEach(ball => {
            ball.xspeed = 0;
            ball.yspeed = 0;
        });

        // Show the "Game Over" text
        gameOverText.setVisible(true);
        return; // Exit the update loop
    }

    balls.forEach(ball => {
        ball.sprite.x += ball.xspeed;
        ball.sprite.y += ball.yspeed;

        // Check for collision with top or bottom walls
        if (ball.sprite.y >= HEIGHT - ball.size / 2 || ball.sprite.y <= ball.size / 2) {
            ball.yspeed *= -1; // Reverse direction
            lives--; // Decrease lives by 1
            livesText.setText(`Lives: ${lives}`); // Update the text display
        }

        // Check for collision with left or right walls
        if (ball.sprite.x >= WIDTH - ball.size / 2 || ball.sprite.x <= ball.size / 2) {
            ball.xspeed *= -1; // Reverse direction
            lives--; // Decrease lives by 1
            livesText.setText(`Lives: ${lives}`); // Update the text display
        }
    });
}