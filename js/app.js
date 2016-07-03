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

    // Boundaries for player hit detection
    var lowX = player.x - 30;
    var highX = player.x + 30;
    var lowY = player.y - 15;
    var highY = player.y + 15;

    // Player hit trigger
    if(lowX <= delta && highX >= delta && lowY <= this.y && highY >= this.y){
        player.damaged();
    }

    // If this enemy goes offscreen, reset his position
    // and give him a new speed. Otherwise continue forward
    if(delta > 540){

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
        this.x = -90;
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
    this.crossed = new SoundPool(10);
    this.crossed.init("crossed");
    this.hit = new SoundPool(20);
    this.hit.init("hit");
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

    // If the next x movement is outside
    // the boundaries, do nothing
    if (newX < 0 || newX > 498){
        this.x = originalX;
    }
    else{
        this.x = newX;
    }

    // Check if the next move collides
    // with an enemy
    for(var i = 0; i < allEnemies.length; i++){
        var lowX = newX - 15;
        var highX = newX + 15;

        var lowY = newY - 15;
        var highY = newY + 15;
        if((lowX <= allEnemies[i].x  && highX >= allEnemies[i].x)
            && (lowY <= allEnemies[i].y && highY >= allEnemies[i].y)){
            this.damaged();
            return;
        }
    }

    // If the player crossed the blue water,
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

// Increase score
Player.prototype.scored = function(){
    this.crossed.get();
    this.score = this.score + 10;
    this.updateScore(this.score);
    this.reset();
}

// Decrease score
Player.prototype.damaged = function(){
    this.hit.get();
    this.score = this.score - 10;
    this.updateScore(this.score);
    this.reset();
}

// Not sure what the purpose of this is.
Player.prototype.update = function(){
}

// Set player back to original starting position
Player.prototype.reset = function(){
    this.x = 205;
    this.y = 375;
    this.speed = 1;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var grunt1 = new Enemy(1,43,70);
var grunt2 = new Enemy(1,126,120);
var grunt3 = new Enemy(1,209,180);
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
