// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Calculate initial movement
    var delta = this.x + this.speed * dt;

    // If this enemy goes offscreen, reset his position
    // and give him a new speed. Otherwise continue forward
    if(delta > 540){
        this.x = -90;

        var speedMultiplier = Math.random() * (3 - 1) + 1;
        var incOrDec = Math.floor(Math.random() * (4 - 1) + 1);
        var newSpeed = 0;

        if(incOrDec >= 2){
            newSpeed = this.speed * speedMultiplier;
        }
        else{
            newSpeed = this.speed / speedMultiplier;
        }

        if(newSpeed > 250){
            newSpeed = 250;
        }
        else if(newSpeed < 100){
            newSpeed = 100;
        }

        this.speed = newSpeed;
    }
    else{
        this.x = delta;
    }


};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed){
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-horn-girl.png';
    this.speed = speed;
    this.score = 0;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Process player input
Player.prototype.handleInput = function(key){

    // Variables later used to determine if
    // position to move to is valid
    var originalX = this.x;
    var originalY = this.y;
    var newX = 0;
    var newY = 0;

   // 101 and 83 were determined to be the
   // row and column sizes
   if (key == 'left'){
        newX = this.x - 101;
        newY = originalY;
    }
    else if (key == "right"){
        newX = this.x + 101;
        newY = originalY;

    }
    else if (key == "up"){
        newY = this.y - 83;
        newX = originalX;
    }
    else if (key == "down"){
        newY = this.y + 83;
        newX = originalX;
    }

    if (newX < 0 || newX > 498){
        this.x = originalX;
    }
    else{
        this.x = newX;
    }

    // If the player cross the blue water,
    // reset and increase the score
    if (newY < 0){
        this.scored();
    }
    else if (newY > 405){
        this.y = originalY;
    }
    else{
        this.y = newY;
    }
}

// A white rectangle is drawn prior to updating the score
// in order to prevent text overlap.
Player.prototype.updateScore = function(score){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0,200,200);
    ctx.font = "30px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("Score: " + score,10,50);
}

Player.prototype.scored = function(){
    this.score = this.score + 10;
    this.updateScore(this.score);
    this.reset();
}

Player.prototype.update = function(){
}

Player.prototype.reset = function(){
    this.x = 205;
    this.y = 375;
    this.speed = 1;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var grunt1 = new Enemy(1,65,70);
var grunt2 = new Enemy(1,145,120);
var grunt3 = new Enemy(1,230,180);
var allEnemies = [];

allEnemies[0] = grunt1;
allEnemies[1] = grunt2;
allEnemies[2] = grunt3;

var player = new Player(205,375,1);

var images = [];
images[1] = "images/enemy-bug.png";
images[0] = "images/char-horn-girl.png";

Resources.load(images);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
