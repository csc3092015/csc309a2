window.onload = function() {
	var level;
	var levelForm = document.getElementById("levelForm");
	var startPage = document.getElementById("startPage");
	var currentPage = 'startPage';
	var gamePage = document.getElementById("gamePage");
	var startButton = document.getElementById("startButton");
	var pauseButton = document.getElementById("pauseButton");
	var backButton = document.getElementById("backButton");
	var viewPortCanvas = document.getElementById("viewPortCanvas");
	var viewPortContext = viewPortCanvas.getContext("2d");
	var viewPortCanvasClear = function() {
		viewPortContext.clearRect(0, 0, viewPortCanvas.width, viewPortCanvas.height);
	}
	var bugList = [];
	var foodList = [];

	var makeBug = function(bugX, bugY) {
		var bugType;
		var bugSpeed;
		var bugScore;
		var bugProbability = Math.random();
		if (bugProbability < 0.3){
			bugType = "black";
			bugScore = 5;
			if (level === 1) {
				bugSpeed = 150;
			} else {
				bugSpeed = 200;
			}
		} else if (bugProbability < 0.6) {
			bugType = "red";
			bugScore = 3;
			if (level === 1) {
				bugSpeed = 75;
			} else {
				bugSpeed = 100;
			}
		} else {
			bugType = "orange";
			bugScore = 1;
			if (level === 1) {
				bugSpeed = 60;
			} else {
				bugSpeed = 80;
			}
		}
		var bug = {
			bugType: bugType,
			bugSpeed: bugSpeed,
			bugScore: bugScore,
			bugX: bugX,
			bugY: bugY
		};
		return bug;
	}

	var getLevel = function() {
		var levelRadioButtons = levelForm.elements["levelRadioButton"];
		for (var i = 0; i < levelRadioButtons.length; i++) {
			if(levelRadioButtons[i].checked){
				level = levelRadioButtons[i].value;
				break;
			}
		}
	}

	var startBackButtonOnclick = function() {
		if (currentPage === 'startPage') {
			getLevel();
			if (typeof(level) === "undefined") {
				alert('You must select which level you want to play');
				return;
			}
			alert(level);
			startPage.style.display = 'none';
			gamePage.style.display = 'block';
			currentPage = 'gamePage';
			viewPortCanvasClear();
		} else {
			startPage.style.display = 'block';
			gamePage.style.display = 'none';
			currentPage = 'startPage';
		}
	}

	var drawBugs = function() {
		setInterval(
			function(){
				viewPortContext.beginPath();
				var bugX = 10 + 380 * Math.random();
				var bugY = 0;
				var bug = makeBug(bugX, bugY);
				bugList.push(bug);
				viewPortContext.arc(bugX, bugY, 20, 0, 2*Math.PI);
				viewPortContext.fillStyle = "green";
				viewPortContext.fill();
				viewPortContext.stroke();
			}, Math.random() * 3000);
	}

	var drawFood = function() {
	}

	function startGame() {
        /* make a sound to start the game and maybe some other things? */
        drawBugs();
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

	startButton.onclick = startBackButtonOnclick;
	backButton.onclick = startBackButtonOnclick;
	startGame();
}