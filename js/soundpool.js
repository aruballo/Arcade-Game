/**
 * A sound pool to use for the sound effects
 * Based on code provided here:
 * http://blog.sklambert.com/html5-canvas-game-html5-audio-and-finishing-touches/
 */
function SoundPool(maxSize) {
	var size = maxSize; // Max sounds allowed in the pool
	var pool = [];
	this.pool = pool;
	var currSound = 0;
	/*
	 * Populates the pool array with the given sound
	 */
	this.init = function(object) {
		if (object == "crossed") {
			for (var i = 0; i < size; i++) {
				// Initalize the sound
				crossed = new Audio("sounds/crossed.mp3");
				crossed.volume = .30;
				crossed.load();
				pool[i] = crossed;
			}
		}
		else if (object == "hit") {
			for (var i = 0; i < size; i++) {
				var hit = new Audio("sounds/hit.mp3");
				hit.volume = .50;
				hit.load();
				pool[i] = hit;
			}
		}
	};
	/*
	 * Plays a sound
	 */
	this.get = function() {
		if(pool[currSound].currentTime == 0 || pool[currSound].ended) {
			pool[currSound].play();
		}
		currSound = (currSound + 1) % size;
	};
}