/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        gameEnded = false,
        grunt1,
        grunt2,
        grunt3,
        allEnemies,
        player;


    var playerImages = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];

    var allImages = [
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Title.png',
        'images/Heart.png',
        'images/Heart2.png',
        'images/Heart3.png',
    ];

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        renderBackground();
        renderEntities();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        if(!gameEnded){
            win.requestAnimationFrame(main);
        }

    }

    // Bring up the main menu with charater choices
    function initMainMenu() {

        grunt1 = new Enemy(1,43,70);
        grunt2 = new Enemy(1,126,120);
        grunt3 = new Enemy(1,209,180);
        allEnemies = [];

        allEnemies[0] = grunt1;
        allEnemies[1] = grunt2;
        allEnemies[2] = grunt3;

        player = new Player(205,375,1);

        renderBackground();
        ctx.drawImage(Resources.get('images/Title.png'), 0, 80, 500, 420);

        ctx.fillStyle = "red";
        ctx.font = "bold 32px Serif";
        ctx.fillText("Click a character to start!", 80,430);

        for(var col = 0; col < 5; col++){
            ctx.drawImage(Resources.get(playerImages[col]), col * 101, 5* 83);
        }

        // Add event listener for `click` events.
        canvas.addEventListener('click', characterClick, false);
    }

    function characterClick(event) {
        var x = event.pageX - 707,
            y = event.pageY - 10;

        if(x >= 0 && x < 101 && y > 460){
            player.sprite = playerImages[0];
        }
        else if(x >= 101 && x < 202 && y > 460){
            player.sprite = playerImages[1];
        }

        else if(x >= 202 && x < 303 && y > 460){
            player.sprite = playerImages[2];
        }

        else if(x >= 303 && x < 404 && y > 460){
            player.sprite = playerImages[3];
        }

        else if(x >= 404 && x <= 505 && y > 460){
            player.sprite = playerImages[4];
        }

        if(x > 0 && y > 460){
            initGame();
            player.updateScore(0);
            player.updateLife(3);
        }

    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function initGame() {
        this.backgroundAudio = new Audio("sounds/Background-Music.mp3");
        this.backgroundAudio.loop = true;
        this.backgroundAudio.volume = .05;
        this.backgroundAudio.load();
        this.backgroundAudio.play();
        // This listens for key presses and sends the keys to your
        // Player.handleInput() method. You don't need to modify this.
        document.addEventListener('keyup', keyUpHandler, false);
        canvas.removeEventListener('click', characterClick, false);
        reset();
        lastTime = Date.now();
        main();
    }

    function gameOver() {
        gameEnded = true;
        renderBackground();
        this.backgroundAudio.pause();
        this.backgroundAudio.currentTime = 0;
        ctx.fillStyle = "red";
        ctx.font = "bold 64px Serif";
        ctx.fillText("GAME OVER!", 40,430);
        ctx.font = "bold 32px Serif";
        ctx.fillText("Press Any Key", 10, 500);
        ctx.fillText("To Continue", 315, 500);
        doc.addEventListener('keydown', function(e){
            if(gameEnded == true){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                gameEnded = false;
                document.removeEventListener("keyup", keyUpHandler, false)
                initMainMenu();
            }
        }, false);
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function renderBackground() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        if(player.life <= 0){
            gameOver();
        }


        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    function keyUpHandler(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    }

    // Enemies our player must avoid
    function Enemy(x, y, speed) {
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
        var lowX = player.x - 35;
        var highX = player.x + 35;
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
    function Player(x, y, speed){
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-horn-girl.png';
        this.speed = speed;
        this.score = 0;
        this.crossed = new SoundPool(10);
        this.crossed.init("crossed");
        this.life = 3;
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
        // All other inputs should be ignored
        else {
            return;
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
        this.life--;
        this.score = this.score - 10;
        this.updateScore(this.score);
        this.updateLife(this.life);
        this.reset();
    }

    Player.prototype.updateLife = function(life){
        var heartsImage = "";

        if(life == 0){

        }

        ctx.fillStyle = "white";
        ctx.fillRect(400, 0,300,300);
        ctx.drawImage(Resources.get(allImages[life + 9]), 400, 0);
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



    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load(allImages);
    Resources.onReady(initMainMenu);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
