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
			bugType = "green";
			bugScore = 5;
			if (level === 1) {
				bugSpeed = 150;
			} else {
				bugSpeed = 200;
			}
		} else if (bugProbability < 0.6) {
			bugType = "yellow";
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

				/* Should check bugType here and draw bug accordingly */
				if(bug.bugType=="green"){
					drawBug1(viewPortContext, bugX, bugY);
				}
				else if(bug.bugType=="yellow"){
					drawBug2(viewPortContext, bugX, bugY);
				}
				else{
					drawBug3(viewPortContext, bugX, bugY);
				}

				// viewPortContext.arc(bugX, bugY, 20, 0, 2*Math.PI);
				// viewPortContext.fillStyle = "green";
				// viewPortContext.fill();
				// viewPortContext.stroke();

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
	
	/* Bug and Food Canvases */
	
	function drawApple(canvas, x, y){
		canvas.beginPath();
		canvas.arc(x,y,9,0,2*Math.PI);
		canvas.fillStyle = "red";
		canvas.fill();
		canvas.strokeStyle = "red";
		canvas.stroke();
		drawLeaves(canvas, x, y);
		drawSmiley(canvas, x, y, 4);
	}
	
	function drawOrange(canvas, x, y){
		canvas.beginPath();
		canvas.arc(x,y,9,0,2*Math.PI);
		canvas.fillStyle = "orange";
		canvas.fill();
		canvas.strokeStyle = "orange";
		canvas.stroke();
		drawLeaves(canvas, x, y);
		drawSmiley(canvas, x, y, 4);
		
	}
	
	function drawLeaves(canvas, x, y){
		canvas.beginPath();
		canvas.moveTo(x+1, y-9);
		canvas.lineTo(x-1, y-9);
		canvas.lineTo(x,y-9);
		canvas.lineTo(x,y-10);
		canvas.lineTo(x+1,y-11);
		canvas.lineTo(x+6,y-11);
		canvas.moveTo(x,y-10);
		canvas.lineTo(x-1,y-11);
		canvas.lineTo(x-6,y-11);
		canvas.strokeStyle = "green";
		canvas.stroke();
	}
	
	function drawSmiley(canvas, x, y, r){
		canvas.beginPath();
		canvas.moveTo(x+2, y-2);
		canvas.lineTo(x+3, y-2);
		canvas.lineTo(x+3, y-1);
		canvas.lineTo(x+2, y-1);
		canvas.lineTo(x+2, y-2);
		canvas.strokeStyle = "black";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.moveTo(x-2, y-2);
		canvas.lineTo(x-3, y-2);
		canvas.lineTo(x-3, y-1);
		canvas.lineTo(x-2, y-1);
		canvas.lineTo(x-2, y-2);
		canvas.strokeStyle = "black";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y+1,r,0,Math.PI);
		canvas.strokeStyle = "black";
		canvas.stroke();
	}
	
	function drawBanana(canvas, x, y){
		canvas.beginPath();
		canvas.arc(x,y,10,0,4.5);
		canvas.lineTo(x-5, y-5);
		canvas.lineTo(x-3, y);
		canvas.lineTo(x-1, y+2);
		canvas.lineTo(x+2, y+1);
		canvas.lineTo(x+5, y+1);
		canvas.lineTo(x+7, y-1);
		canvas.lineTo(x+5, y);
		canvas.fillStyle = "yellow";
		canvas.fill();
		canvas.strokeStyle = "black";
		canvas.stroke();
		drawBananaLines(canvas, x, y);
	}
	
	function drawBananaLines(canvas, x, y){
		canvas.beginPath();
		canvas.arc(x+2,y-2,8,0.5,4);
		canvas.strokeStyle = "black";
		canvas.stroke();
	}
	
	function drawBug1(canvas, x, y){
		canvas.beginPath();
		canvas.moveTo(x+6,y);
		canvas.lineTo(x-6,y);
		canvas.moveTo(x+6,y+4);
		canvas.lineTo(x-6,y+4);
		canvas.moveTo(x+6,y-4);
		canvas.lineTo(x-6,y-4);
		canvas.moveTo(x+6,y-8);
		canvas.lineTo(x-6,y-8);
		canvas.moveTo(x+6,y-12);
		canvas.lineTo(x-6,y-12);
		canvas.moveTo(x+6,y-16);
		canvas.lineTo(x-6,y-16);
		canvas.moveTo(x+6,y-20);
		canvas.lineTo(x-6,y-20);
		canvas.strokeStyle = "Green ";
		canvas.stroke();
		
		canvas.scale(0.5, 1);
		canvas.beginPath();
		canvas.arc(x*2,y,6,0,2*Math.PI);
		canvas.fillStyle = "green";
		canvas.fill();
		canvas.strokeStyle = "green";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.scale(2, 1);
		canvas.arc(x,y+11,5,0,2*Math.PI)
		canvas.fillStyle = "Chartreuse";
		canvas.fill();
		canvas.strokeStyle = "Chartreuse";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-9,3,0,2*Math.PI)
		canvas.fillStyle = "Green";
		canvas.fill();
		canvas.strokeStyle = "Green";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-15,3,0,2*Math.PI)
		canvas.fillStyle = "Green";
		canvas.fill();
		canvas.strokeStyle = "Green";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-21,3,0,2*Math.PI)
		canvas.fillStyle = "Green";
		canvas.fill();
		canvas.strokeStyle = "Green";
		canvas.stroke();
		
		drawSmiley(canvas, x, y+10, 2)
	}
	
	function drawBug2(canvas, x, y){
		canvas.beginPath();
		canvas.moveTo(x+6,y);
		canvas.lineTo(x-6,y);
		canvas.moveTo(x+6,y+4);
		canvas.lineTo(x-6,y+4);
		canvas.moveTo(x+6,y-4);
		canvas.lineTo(x-6,y-4);
		canvas.moveTo(x+6,y-8);
		canvas.lineTo(x-6,y-8);
		canvas.moveTo(x+6,y-12);
		canvas.lineTo(x-6,y-12);
		canvas.moveTo(x+6,y-16);
		canvas.lineTo(x-6,y-16);
		canvas.moveTo(x+6,y-20);
		canvas.lineTo(x-6,y-20);
		canvas.strokeStyle = "Black ";
		canvas.stroke();
		
		canvas.scale(0.5, 1);
		canvas.beginPath();
		canvas.arc(x*2,y,6,0,2*Math.PI);
		canvas.fillStyle = "Black";
		canvas.fill();
		canvas.strokeStyle = "Black";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x*2,y,6,0,2*Math.PI);
		canvas.fillStyle = "Black";
		canvas.fill();
		canvas.strokeStyle = "Black";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.scale(2, 1);
		canvas.arc(x,y+11,5,0,2*Math.PI)
		canvas.fillStyle = "Yellow";
		canvas.fill();
		canvas.strokeStyle = "Yellow";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-9,3,0,2*Math.PI)
		canvas.fillStyle = "Yellow";
		canvas.fill();
		canvas.strokeStyle = "Yellow";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-15,3,0,2*Math.PI)
		canvas.fillStyle = "Black";
		canvas.fill();
		canvas.strokeStyle = "Black";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-21,3,0,2*Math.PI)
		canvas.fillStyle = "Yellow";
		canvas.fill();
		canvas.strokeStyle = "Yellow";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x+4,y-3,4,0,2*Math.PI);
		canvas.fillStyle = "White";
		canvas.fill();
		canvas.strokeStyle = "Black";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x-4,y-3,4,0,2*Math.PI);
		canvas.fillStyle = "White";
		canvas.fill();
		canvas.strokeStyle = "Black";
		canvas.stroke();
		
		drawSmiley(canvas, x, y+10, 2)
	}
	
	function drawBug3(canvas, x, y){
		canvas.beginPath();
		canvas.moveTo(x+6,y);
		canvas.lineTo(x-6,y);
		canvas.moveTo(x+6,y+4);
		canvas.lineTo(x-6,y+4);
		canvas.moveTo(x+6,y-4);
		canvas.lineTo(x-6,y-4);
		canvas.moveTo(x+6,y-8);
		canvas.lineTo(x-6,y-8);
		canvas.moveTo(x+6,y-12);
		canvas.lineTo(x-6,y-12);
		canvas.moveTo(x+6,y-16);
		canvas.lineTo(x-6,y-16);
		canvas.moveTo(x+6,y-20);
		canvas.lineTo(x-6,y-20);
		canvas.strokeStyle = "Orange";
		canvas.stroke();
		
		canvas.scale(0.5, 1);
		canvas.beginPath();
		canvas.arc(x*2,y,6,0,2*Math.PI);
		canvas.fillStyle = "Orange";
		canvas.fill();
		canvas.strokeStyle = "Orange";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.scale(2, 1);
		canvas.arc(x,y+11,5,0,2*Math.PI)
		canvas.fillStyle = "Orange";
		canvas.fill();
		canvas.strokeStyle = "Orange";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-9,3,0,2*Math.PI)
		canvas.fillStyle = "Orange";
		canvas.fill();
		canvas.strokeStyle = "Orange";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-15,3,0,2*Math.PI)
		canvas.fillStyle = "Orange";
		canvas.fill();
		canvas.strokeStyle = "Orange";
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-21,3,0,2*Math.PI)
		canvas.fillStyle = "Orange";
		canvas.fill();
		canvas.strokeStyle = "Orange";
		canvas.stroke();
		
		drawSmiley(canvas, x, y+10, 2)
	}

	startButton.onclick = startBackButtonOnclick;
	backButton.onclick = startBackButtonOnclick;
	startGame();
}