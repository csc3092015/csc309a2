window.onload = function() {
	var startPage = document.getElementById("startPage");
	var currentPage = 'startPage';
	var gamePage = document.getElementById("gamePage");
	var startButton = document.getElementById("startButton");
	var pauseButton = document.getElementById("pauseButton");
	var backButton = document.getElementById("backButton");
	
	/* Bug and Food Canvases */
	var gameCanvas = document.getElementById("gameCanvas").getContext("2d");

	function startBackButtonOnclick() {
		if (currentPage === 'startPage') {
			startPage.style.display = 'none';
			gamePage.style.display = 'block';
			currentPage = 'gamePage';
		} else {
			startPage.style.display = 'block';
			gamePage.style.display = 'none';
			currentPage = 'startPage';
		}
	}

	function startGame() {
        /* make a sound to start the game and maybe some other things? */
	}

	function pauseUnpause(){
	        /* If game is paused, resume. Otherwise pause. */
	}

	function endGame(){
	        /* When the timer hits 0, this should be called to end the game */
	}

	function animate(){
	        /* Use this to change the frame of the game per how-ever-many milliseconds to animate game */
	}
	
	function drawApple(){
		
	}
	
	function drawOrange(){
		
	}
	
	function drawBanana(){
		
	}
	
	function drawBug1(){
		
	}
	
	function drawBug2(){
		
	}

	startButton.onclick = startBackButtonOnclick;
	backButton.onclick = startBackButtonOnclick;
}