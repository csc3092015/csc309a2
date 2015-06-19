window.onload = function() {
	// GLOBAL VARIABLE
	var lastTimeBugSpawnedInMillie;
	var startTime;
	var paused = false;
	var level;
	var levelOneHighscore = 0;
	var levelTwoHighscore = 0;
	var score = 0;
	var highScore = 0;
	var levelForm = document.getElementById("levelForm");
	var startPage = document.getElementById("startPage");
	var levelOneButton = document.getElementById("levelOne");
	var levelTwoButton = document.getElementById("levelTwo");
	var currentPage = 'startPage';
	var gamePage = document.getElementById("gamePage");
	var gameOverPage = document.getElementById("gameOverPage");
	var startButton = document.getElementById("startButton");
	var restartButton = document.getElementById("restartButton");
	var pauseButton = document.getElementById("pauseButton");
	var backButton = document.getElementById("backButton");
	var viewPort = document.getElementById("viewPort");
	var viewPortCanvas = document.getElementById("viewPortCanvas");
	var currentScorePara = document.getElementById("currentScore");
	var highScorePara = document.getElementById("highScore");
	var scorePopPara = document.getElementById("scorePop");
	var timePara = document.getElementById("timeLeft");
	var viewPortContext = viewPortCanvas.getContext("2d");
	var bugList = [];
	var foodList = [];
	var bugToFadeList = [];
	var createBugsIntervalId;
	var reDrawObjectsIntervalId;
	var testPop = document.getElementById("testPop");
	var testPage = document.getElementById("testPage");
	var levelRadioButtons = levelForm.elements["levelRadioButton"];
	var testButton = document.getElementById("testButton");
	var testButtonPressed = false;

	// CONSTANT
	var LEVEL1_HIGH_SCORE_LOCAL_STORAGE_KEY = "highScoreKey1";
	var LEVEL2_HIGH_SCORE_LOCAL_STORAGE_KEY = "highScoreKey2";
	var DEFAULT_GAME_LENGTH_SEC = 60;
	var DEFAULT_BUG_FADE_TIME_MILLIE = 2000;
	var DEFAULT_BUG_ALPHA = 1.0; // defualt opacity is having no opacity!
	var FRAME_RATE = 60;
	var TOTAL_FOOD_NUMBER = 5;
	var OVERLAP_DISTANCE = 20;
	var DEFAULT_BUG_WIDTH = 10;
	var DEFAULT_BUG_HEIGHT = 40;
	var DEFAULT_FOOD_WIDTH = 20;
	var DEFAULT_FOOD_HEIGHT = 20;
	var FOOD_SPAWN_HEIGHT = viewPortCanvas.height - 50;
	var FOOD_TYPES = ["apple", "orange", "pear", "plum", "banana"];
	var BUG_KILL_RADIUS = 30;
	var BUG_SPAWN_LOWER_BOUND_MILLIE = 1000;
	var BUG_SPAWN_UPPER_BOUND_MILLIE = 3000;
	var GAME_HEIGHT = 600;

	// GLOBAL VARIBALE DEPEND ON CONSTANT
	var timeRemaining = DEFAULT_GAME_LENGTH_SEC;


	/**************************************************************
	****        MAIN				 						*******
	***************************************************************/
	function startGame() {
		gameOverPage.style.display = 'none';
		dropAll();
		upDateVisualScore();
		updateStartTime();
		updateVisualTimeRemaining();
        createFoods();
        createBugs();
        reDrawObjects();
        // resetTimeRemaining();
	}

	function pauseUnpause(){
	        /* If game is paused, resume. Otherwise pause. */
	    if(!isGameOver()){
			if(paused === true){
	        	updateStartTime();
		        updateVisualTimeRemaining();
		        createBugs();
		        reDrawObjects();
		        pauseButton.innerHTML = "Pause";
		        paused = false;
	        }
	        else{
		        window.clearInterval(createBugsIntervalId);
		        window.clearInterval(reDrawObjectsIntervalId);
		        pauseButton.innerHTML = "Play";
		        paused = true;
	        }   
	    }
	}

	function reDrawObjects(){
		reDrawObjectsIntervalId = setInterval(animate, 1000/FRAME_RATE);
	}

	function animate() {
		/* Use this to change the frame of the game per how-ever-many milliseconds to animate game */
		if(isGameOver()) {
			endGame();
			return;
		}
		viewPortCanvasClear();
		drawBugs();
		drawFoods();
		updateTime();
	}

	function endGame(){
		window.clearInterval(createBugsIntervalId);
		window.clearInterval(reDrawObjectsIntervalId);
		dropAll();
		getLevel();
		calculateHighScore();
		setHighScore();
		resetTimeRemaining();
		gameOverPopup();
		resetScore();
	}

	/**************************************************************
	****        GENERAL HELPER		 						*******
	***************************************************************/
	var viewPortCanvasClear = function() {
		viewPortContext.clearRect(0, 0, viewPortCanvas.width, viewPortCanvas.height);
	}

	var dropAll = function() {
		foodList = [];
		bugList = [];
		viewPortCanvasClear();
	}

	var getLevel = function() {
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
			startPage.style.display = 'none';
			gamePage.style.display = 'block';
			currentPage = 'gamePage';
			viewPortCanvasClear();
			startGame();
		} 
		else {
			gameOverPage.style.display = 'none';
			startPage.style.display = 'block';
			gamePage.style.display = 'none';
			currentPage = 'startPage';
		}
	}
	
	var gameOverPopup = function() {
		gameOverPage.style.display = 'block';
		scorePopPara.innerHTML = "Your current score is: " + score.toString();
	}

	function isGameOver() {
		if (foodList.length === 0 || Math.floor(timeRemaining) <= 0) {
			return true;
		}
		return false;
	}

	function deleteObj(objToDelete, objList) {
		var objIndex = objList.indexOf(objToDelete);
		if (objIndex > -1) {
			objList.splice(objIndex, 1);
		}
	}
	
	function calculateHighScore(){
		if(level == 1 && score > levelOneHighscore){
			levelOneHighscore = score;
		}
		else if(score > levelTwoHighscore){
			levelTwoHighscore = score;
		}
	}
	
	function setHighScore(){
		getLevel();
		// Check browser support
		if (typeof(Storage) != "undefined") {
		    // Store
		    levelOneHighscore = Math.max(localStorage.getItem(LEVEL1_HIGH_SCORE_LOCAL_STORAGE_KEY), levelOneHighscore);
		    levelTwoHighscore = Math.max(localStorage.getItem(LEVEL2_HIGH_SCORE_LOCAL_STORAGE_KEY), levelTwoHighscore);
		    localStorage.setItem(LEVEL1_HIGH_SCORE_LOCAL_STORAGE_KEY, levelOneHighscore);
		    localStorage.setItem(LEVEL2_HIGH_SCORE_LOCAL_STORAGE_KEY, levelTwoHighscore);
		    // Retrieve
		    if(level == 1){
			    highScorePara.innerHTML = "High Score: " + localStorage.getItem(LEVEL1_HIGH_SCORE_LOCAL_STORAGE_KEY).toString();
		    }
		    else{
			    highScorePara.innerHTML = "High Score: " + localStorage.getItem(LEVEL2_HIGH_SCORE_LOCAL_STORAGE_KEY).toString();
		    }
		} else {
			if(level == 1){
				highScorePara.innerHTML = "High Score: " + levelOneHighscore.toString();
			}
			else{
				highScorePara.innerHTML = "High Score: " + levelTwoHighscore.toString();
			}
		}
		highScorePara.style.fontSize = "Medium";
	}
	
	function resetScore(){
		score = 0;
	}

	function upDateVisualScore() {
		currentScorePara.innerHTML = "Score: " + score.toString();
	}
	
	function shuffle(list){
		for(var randomeIndex, sweeperIndexedElement, sweeperIndex = list.length; 
			sweeperIndex; randomeIndex = Math.floor(Math.random() * sweeperIndex),
			//first store sweeperIndexedElement
			sweeperIndexedElement = list[--sweeperIndex], 
			//put the random element into sweeper index position
			list[sweeperIndex] = list[randomeIndex], 
			//swap back stored element into random indexed position
			list[randomeIndex] = sweeperIndexedElement);
			return list;
	}


	function getFunctionName() {
		/*http://www.esqsoft.com/javascript/functions/how-to-get-function-name-from-itself.htm*/
		return arguments.callee.caller.toString().match(/function ([^\(]+)/)[1];
	}
	/**************************************************************
	****        TIMER FUNCTIONS       						*******
	***************************************************************/
	
	function updateVisualTimeRemaining(){
		timePara.innerHTML = "Time: " + Math.floor(timeRemaining).toString();
	}

	function updateStartTime() {
		startTime = new Date().getTime();
	}
	
	function updateTime(){
		var currentTime = new Date().getTime();
		var timeElapsed = currentTime - startTime;
		startTime = currentTime;
		timeRemaining = timeRemaining - timeElapsed/1000;
		if(Math.floor(timeRemaining>0)){
			updateVisualTimeRemaining();	
		}
	}
	
	function resetTimeRemaining(){
		timeRemaining = DEFAULT_GAME_LENGTH_SEC;
	}

	/**************************************************************
	****        DRAW BUGS and FOODS 						*******
	***************************************************************/

	function drawBugs() {
		for(i = bugList.length - 1; i >= 0; i--){
			drawBug(moveBug(bugList[i]));
		}
		for(i = bugToFadeList.length - 1; i >= 0; i--){
			if (bugToFadeList[i].bugAlpha > 0){
				drawBug(bugToFadeList[i], 
					DEFAULT_BUG_ALPHA/(DEFAULT_BUG_FADE_TIME_MILLIE/FRAME_RATE));		
			} else {
				deleteObj(bugToFadeList[i], bugToFadeList);
			}
		}
	}
	
	function drawFoods(){
		for(i=0; i<foodList.length; i++){
			drawFood(foodList[i]);
		}
	}
	/**************************************************************
	****        CREATE BUGS and FOODS 						*******
	***************************************************************/

	var createBugs = function() {
		createBugsIntervalId =			
		setTimeout(
			function(){
				lastTimeBugSpawnedInMillie = new Date().getTime();
				var bugX = 10 + 380 * Math.random();
				var bugY = 0;
				var bug = makeBug(bugX, bugY);
				bugList.push(bug);
				drawBug(bug);
				createBugs();
			}, bugSpawnTimeInterval()
		);
	}

	function bugSpawnTimeInterval() {
		// we have to minus the total elapsed time, since the user
		// can just keep clicking pause button
		var interval = // every 1-3 seconds
			BUG_SPAWN_LOWER_BOUND_MILLIE 
			+ Math.random() 
			* (BUG_SPAWN_UPPER_BOUND_MILLIE - BUG_SPAWN_LOWER_BOUND_MILLIE);
		lastTimeBugSpawnedInMillie = lastTimeBugSpawnedInMillie || startTime	
		var timeElapsedSinceLastBugSpawned = 
		new Date().getTime() - lastTimeBugSpawnedInMillie;
		// alert(timeElapsedSinceLastBugSpawned);
		return interval - timeElapsedSinceLastBugSpawned;
	}
	
	var createFoods = function(){
		var food;
		var foodX;
		var foodY;
		// calculating spacing between food
			// each food has 20 px width
			// so total with food is going to take up on a line is:
			// 20 * TOTAL_FOOD_NUMBER
			// default width  
		var spacing = 
			(viewPortCanvas.width - DEFAULT_FOOD_WIDTH * TOTAL_FOOD_NUMBER) /
				(TOTAL_FOOD_NUMBER + 1);
		shuffle(FOOD_TYPES);
		for (var i = 0; i < TOTAL_FOOD_NUMBER; i++) {
			foodX = (i + 1) * spacing + i * DEFAULT_FOOD_WIDTH;
			/* Formula below found on http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range */
			foodY = Math.random() * ((GAME_HEIGHT - DEFAULT_FOOD_HEIGHT/2) - (GAME_HEIGHT / 2 + DEFAULT_FOOD_HEIGHT/2)) + (GAME_HEIGHT / 2 + DEFAULT_FOOD_HEIGHT/2);
			food = makeFood(foodX, foodY, FOOD_TYPES[i]);
			foodList.push(food); 
			drawFood(food);
		};
	}

	/*********EVERY THING BELOW IS FOR INDIVIDUAL BUG OR FOOD*****************/
	/*********EVERY THING BELOW IS FOR INDIVIDUAL BUG OR FOOD*****************/
	/*********EVERY THING BELOW IS FOR INDIVIDUAL BUG OR FOOD*****************/


	/**************************************************************
	****         MAKE BUG and FOOD 					 		*******
	***************************************************************/
	var bugObject = function(bugX, bugY, bugType, bugSpeed, bugScore) {
		var self = this;
		self.bugAlpha = DEFAULT_BUG_ALPHA;
		self.bugX = bugX;
		self.bugY = bugY;
		self.bugType = bugType;
		self.bugSpeed = bugSpeed;
		self.bugScore = bugScore;
		self.bugClosestFood;
		self.bugClosestFoodDistance;
		self.bugIncrementX;
		self.bugIncrementY;
		self.setClosestFood = function(){
			var deltaX;
			var deltaY;
			var distance;
			var food;
			var minDistance;
			for (var i = 0; i < foodList.length; i++) {
				food = foodList[i];
				deltaX = food.foodX - self.bugX;
				deltaY = food.foodY - self.bugY;
				distance = Math.sqrt(Math.pow((deltaX), 2) + Math.pow(deltaY, 2));
				if (typeof minDistance === "undefined" || minDistance > distance) {
					minDistance = distance;
					self.bugClosestFoodDistance = distance;
					self.bugClosestFood = food;
					self.bugIncrementX = (((deltaX)/distance)*self.bugSpeed)/FRAME_RATE;
					self.bugIncrementY = (((deltaY)/distance)*self.bugSpeed)/FRAME_RATE;
				} 
			}
		};
		self.getDistance = function(targetX, targetY) {
			var bugX = self.bugX;
			var bugY = self.bugY;
			
			if((targetX > (self.bugX - DEFAULT_BUG_WIDTH / 2)) && ( targetX < (self.bugX + DEFAULT_BUG_WIDTH / 2))){
				// Within X bounds 
				bugX = targetX;
				if((targetY > (self.bugY - DEFAULT_BUG_HEIGHT / 2)) && (targetY < (self.bugY + DEFAULT_BUG_HEIGHT / 2))){
					// Within Y bounds 
					bugY = targetY;
				}
				else if(targetY > (self.bugY + DEFAULT_BUG_HEIGHT / 2)){
					// Top of rectangle
					bugY = bugY + DEFAULT_BUG_HEIGHT / 2;
				}
				else if(targetY < (self.bugY - DEFAULT_BUG_HEIGHT / 2)){
					// Bottom of rectangle
					bugY = bugY - DEFAULT_BUG_HEIGHT / 2;
				}
			}
			else if((targetY > (self.bugY - DEFAULT_BUG_HEIGHT / 2)) && (targetY < (self.bugY + DEFAULT_BUG_HEIGHT / 2))){
				// Within Y bounds 
				bugY = targetY;
				if(targetX < (self.bugX - DEFAULT_BUG_WIDTH / 2)){
					// Left of rectangle
					bugX = bugX - DEFAULT_BUG_WIDTH / 2;
				}
				else if(targetX > (self.bugX + DEFAULT_BUG_WIDTH / 2)){
					// Right of rectangle
					bugX = bugX + DEFAULT_BUG_WIDTH / 2;
				}
			}
			else if((targetX < (self.bugX - DEFAULT_BUG_WIDTH / 2)) && (targetY > (self.bugY + DEFAULT_BUG_HEIGHT / 2))){
				// Top left corner 
				bugX = bugX - DEFAULT_BUG_WIDTH / 2;
				bugY = bugY + DEFAULT_BUG_HEIGHT / 2;
			}
			else if((targetX > (self.bugX + DEFAULT_BUG_WIDTH / 2)) && (targetY > (self.bugY + DEFAULT_BUG_HEIGHT / 2))){
				// Top right corner 
				bugX = bugX + DEFAULT_BUG_WIDTH / 2;
				bugY = bugY + DEFAULT_BUG_HEIGHT / 2;
			}
			else if((targetX < (self.bugX - DEFAULT_BUG_WIDTH / 2)) && (targetY < (self.bugY - DEFAULT_BUG_HEIGHT / 2))){
				// Bottom left corner 
				bugX = bugX - DEFAULT_BUG_WIDTH / 2;
				bugY = bugY - DEFAULT_BUG_HEIGHT / 2;
			}
			else{
				// Bottom right corner
				bugX = bugX + DEFAULT_BUG_WIDTH / 2;
				bugY = bugY - DEFAULT_BUG_HEIGHT / 2;
			}
			var deltaX = targetX - bugX;
			var deltaY = targetY - bugY;
			return Math.sqrt(Math.pow((deltaX), 2) + Math.pow(deltaY, 2));
		};
		self.setBugAlpha = function(newAlpha) {
			self.bugAlpha = newAlpha;
		}
	}


	var makeBug = function(bugX, bugY) {
		var bugType;
		var bugSpeed;
		var bugProbability = Math.random();
		var bugFoodTarget;
		var bugScore;
		if (bugProbability < 0.3){
			bugType = "black"; // This should be black according to handout
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

		var bug = new bugObject(bugX, bugY, bugType, bugSpeed, bugScore);
		bug.setClosestFood();
		return bug;
	}
	
	var makeFood = function(foodX, foodY, foodType) {
		var food = {
			foodType: foodType,
			foodX: foodX,
			foodY: foodY
		};
		return food;
	}

	/**************************************************************
	****        BUG OPERATION	 							*******
	***************************************************************/
	
	function moveBug(bug){
		bug.setClosestFood();
		if(bug.bugClosestFoodDistance < OVERLAP_DISTANCE){
			deleteObj(bug.bugClosestFood, foodList);
		}
		else{
			bug.bugX += bug.bugIncrementX;
			bug.bugY += bug.bugIncrementY;
		}
		return bug;
	}
	
	function killBugs(event){
		/* Two websites used to come up with this:
			1. http://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
			2. http://www.kirupa.com/html5/getting_mouse_click_position.htm
		*/
		if(!paused){
			var bug;
			var rectangle = viewPortCanvas.getBoundingClientRect();
			var x_skew = rectangle.left;
			var y_skew = rectangle.top;
			var x = event.clientX - x_skew;
			var y = event.clientY - y_skew;
			for(i = bugList.length - 1; i >= 0; i--){
				bug = bugList[i];
				if (bug.getDistance(x, y) <= BUG_KILL_RADIUS){
					score+=bug.bugScore;
					bugToFadeList.push(bug);
					deleteObj(bug, bugList);
					upDateVisualScore();
				}
			}	
		}
	}

	/**************************************************************
	****         DRAW BUG and FOOD 							*******
	***************************************************************/

	function drawBug(bugObject, deltaAlpha){
		deltaAlpha = deltaAlpha || 0;
		drawBugGeneral(bugObject, deltaAlpha);
		if(bugObject.bugType === "red"){
			// somehow the red is mutated so they have wings!
			drawBugWings(bugObject, deltaAlpha);
		}
	}
	
	function drawFood(food){
		if(food.foodType=="apple"){
			drawApple(food);
		}
		else if(food.foodType=="orange"){
			drawOrange(food);
		}
		else if(food.foodType=="pear"){
			drawPear(food);
		}
		else if(food.foodType=="plum"){
			drawPlum(food);
		}
		else if(food.foodType=="banana"){
			drawBanana(food);
		}	
	}
	
	/**************************************************************
	****         DRAW SPECIFIC FOOD 						*******
	***************************************************************/
	
	function drawApple(apple){
		var x = apple.foodX;
		var y = apple.foodY;
		drawCircle(x, y, "red");	
		drawLeaves(x, y);
		drawSmiley(x, y, 4);
	}
	
	function drawOrange(orange){
		var x = orange.foodX;
		var y = orange.foodY;
		drawCircle(x, y, "orange");		
		drawLeaves(x, y);
		drawSmiley(x, y, 4);
	}

	function drawPear(pear){
		var x = pear.foodX;
		var y = pear.foodY;
		drawCircle(x, y, "White");		
		drawLeaves(x, y);
		drawSmiley(x, y, 4);
	}

	function drawPlum(plum){
		var x = plum.foodX;
		var y = plum.foodY;
		drawCircle(x, y, "purple");		
		drawLeaves(x, y);
		drawSmiley(x, y, 4);
	}
	
	function drawBanana(banana){
		drawBananaBody(banana);
		drawBananaLines(banana);
	}
	
	/**************************************************************
	****         DRAW HELPER for Object						*******
	***************************************************************/

	// function name specify which object it is drawing so the argument should be the object itself
	
	function drawBugWings(bugObject, deltaAlpha){
		viewPortContext.save();
		viewPortContext.globalAlpha = bugObject.bugAlpha;
		bugObject.setBugAlpha(bugObject.bugAlpha - deltaAlpha);
		var x = bugObject.bugX;
		var y = bugObject.bugY;
		viewPortContext.beginPath();
		viewPortContext.arc(x+4,y-3,4,0,2*Math.PI);
		viewPortContext.fillStyle = "White";
		viewPortContext.fill();
		viewPortContext.strokeStyle = "Black";
		viewPortContext.stroke();
		
		viewPortContext.beginPath();
		viewPortContext.arc(x-4,y-3,4,0,2*Math.PI);
		viewPortContext.fillStyle = "White";
		viewPortContext.fill();
		viewPortContext.strokeStyle = "Black";
		viewPortContext.stroke();
		viewPortContext.restore();
	}
	
	function drawBugGeneral(bugObject, deltaAlpha){
		viewPortContext.save();
		viewPortContext.globalAlpha = bugObject.bugAlpha;
		bugObject.setBugAlpha(bugObject.bugAlpha - deltaAlpha);
		var x = bugObject.bugX;
		var y = bugObject.bugY;
		var color = bugObject.bugType;
		drawBugLegs(bugObject);
		if(color=="black"){
			colorSecond = "grey";
		}
		else{
			colorSecond = color;
		}
		
		viewPortContext.scale(0.5, 1);
		viewPortContext.beginPath();
		viewPortContext.arc(x*2,y+4,6,0,2*Math.PI);
		viewPortContext.fillStyle = color;
		viewPortContext.fill();
		viewPortContext.strokeStyle = color;
		viewPortContext.stroke();
		
		viewPortContext.beginPath();
		viewPortContext.scale(2, 1);
		viewPortContext.arc(x,y+15,5,0,2*Math.PI)
		viewPortContext.fillStyle = colorSecond;
		viewPortContext.fill();
		viewPortContext.strokeStyle = colorSecond;
		viewPortContext.stroke();
		
		viewPortContext.beginPath();
		viewPortContext.arc(x,y-5,3,0,2*Math.PI)
		viewPortContext.fillStyle = colorSecond;
		viewPortContext.fill();
		viewPortContext.strokeStyle = colorSecond;
		viewPortContext.stroke();
		
		viewPortContext.beginPath();
		viewPortContext.arc(x,y-11,3,0,2*Math.PI)
		viewPortContext.fillStyle = color;
		viewPortContext.fill();
		viewPortContext.strokeStyle = color;
		viewPortContext.stroke();
		
		viewPortContext.beginPath();
		viewPortContext.arc(x,y-17,3,0,2*Math.PI)
		viewPortContext.fillStyle = colorSecond;
		viewPortContext.fill();
		viewPortContext.strokeStyle = colorSecond;
		viewPortContext.stroke();
		
		/* For debugging
		viewPortContext.beginPath();
		viewPortContext.arc(x,y,20,0,2*Math.PI)
		viewPortContext.strokeStyle = "black";
		viewPortContext.stroke();*/
		
		drawSmiley(x, y+14, 2);

		viewPortContext.restore();
	}

	function drawBugLegs(bugObject){
		var x = bugObject.bugX;
		var y = bugObject.bugY;
		viewPortContext.beginPath();
		viewPortContext.moveTo(x+6,y+4);
		viewPortContext.lineTo(x-6,y+4);
		viewPortContext.moveTo(x+6,y+8);
		viewPortContext.lineTo(x-6,y+8);
		viewPortContext.moveTo(x+6,y);
		viewPortContext.lineTo(x-6,y);
		viewPortContext.moveTo(x+6,y-4);
		viewPortContext.lineTo(x-6,y-4);
		viewPortContext.moveTo(x+6,y-8);
		viewPortContext.lineTo(x-6,y-8);
		viewPortContext.moveTo(x+6,y-12);
		viewPortContext.lineTo(x-6,y-12);
		viewPortContext.moveTo(x+6,y-16);
		viewPortContext.lineTo(x-6,y-16);
		viewPortContext.strokeStyle = "Black";
		viewPortContext.stroke();
	}

	function drawBananaBody(banana){
		var x = banana.foodX;
		var y = banana.foodY;
		viewPortContext.beginPath();
		viewPortContext.arc(x,y,10,0,4.5);
		viewPortContext.lineTo(x-5, y-5);
		viewPortContext.lineTo(x-3, y);
		viewPortContext.lineTo(x-1, y+2);
		viewPortContext.lineTo(x+2, y+1);
		viewPortContext.lineTo(x+5, y+1);
		viewPortContext.lineTo(x+7, y-1);
		viewPortContext.lineTo(x+5, y);
		viewPortContext.fillStyle = "yellow";
		viewPortContext.fill();
		viewPortContext.strokeStyle = "black";
		viewPortContext.stroke();
	}

	function drawBananaLines(banana){
		var x = banana.foodX;
		var y = banana.foodY;
		viewPortContext.beginPath();
		viewPortContext.arc(x+2,y-2,8,0.5,4);
		viewPortContext.strokeStyle = "black";
		viewPortContext.stroke();
	}

	/**************************************************************
	****         DRAW HELPER with x, y					***********
	***************************************************************/

	// Really these should be private functions 
	// since they are object independent
	function drawCircle(x, y, color){
		viewPortContext.beginPath();
		viewPortContext.arc(x,y,9,0,2*Math.PI);
		viewPortContext.fillStyle = color;
		viewPortContext.fill();
		viewPortContext.strokeStyle = color;
		viewPortContext.stroke();
	}
	
	function drawLeaves(x, y){
		viewPortContext.beginPath();
		viewPortContext.moveTo(x+1, y-9);
		viewPortContext.lineTo(x-1, y-9);
		viewPortContext.lineTo(x,y-9);
		viewPortContext.lineTo(x,y-10);
		viewPortContext.lineTo(x+1,y-11);
		viewPortContext.lineTo(x+6,y-11);
		viewPortContext.moveTo(x,y-10);
		viewPortContext.lineTo(x-1,y-11);
		viewPortContext.lineTo(x-6,y-11);
		viewPortContext.strokeStyle = "green";
		viewPortContext.stroke();
	}
	
	function drawSmiley(x, y, r){
		// right eye
		viewPortContext.beginPath();
		viewPortContext.moveTo(x+2, y-2);
		viewPortContext.lineTo(x+3, y-2);
		viewPortContext.lineTo(x+3, y-1);
		viewPortContext.lineTo(x+2, y-1);
		viewPortContext.lineTo(x+2, y-2);
		viewPortContext.strokeStyle = "black";
		viewPortContext.stroke();
		
		// left eye
		viewPortContext.beginPath();
		viewPortContext.moveTo(x-2, y-2);
		viewPortContext.lineTo(x-3, y-2);
		viewPortContext.lineTo(x-3, y-1);
		viewPortContext.lineTo(x-2, y-1);
		viewPortContext.lineTo(x-2, y-2);
		viewPortContext.strokeStyle = "black";
		viewPortContext.stroke();
		
		// smile
		viewPortContext.beginPath();
		viewPortContext.arc(x,y+1,r,0,Math.PI);
		viewPortContext.strokeStyle = "black";
		viewPortContext.stroke();
	}

	startButton.onclick = startBackButtonOnclick;
	backButton.onclick = startBackButtonOnclick;
	restartButton.onclick = startGame;
	pauseButton.onclick = pauseUnpause;
	viewPortCanvas.onclick = killBugs;
	levelOneButton.onclick = setHighScore;
	levelTwoButton.onclick = setHighScore;
	setHighScore();
	
	/**************************************************************
	****                         TESTING				***********
	***************************************************************/
	
	function testGame(){
		function setup(){
			highScore = 0;
			levelOneHighscore = 0;
			levelTwoHighscore = 0;
			testPage.style.display = "block";
			localStorage.clear();
			var newParaTag = document.createElement("p");
			var newText = document.createTextNode("Test Log");
			newParaTag.appendChild(newText);
			testPop.appendChild(newParaTag);
		}

		function testButtonToggle(){
			testPopClear();
			if(!testButtonPressed){
				testButtonPressed = true;
				startTest();
			}
			else {
				testButtonPressed = false;
				testPage.style.display = "none";
			}
		}

		function testPopClear() {
			while(testPop.lastChild){
				testPop.removeChild(testPop.lastChild);
			}
		}
		
		function takeDown(){
			highScore = 0;
			levelOneHighscore = 0;
			levelTwoHighscore = 0;
			localStorage.setItem(LEVEL1_HIGH_SCORE_LOCAL_STORAGE_KEY, levelOneHighscore);
		    localStorage.setItem(LEVEL2_HIGH_SCORE_LOCAL_STORAGE_KEY, levelTwoHighscore);
			levelRadioButtons[0].checked = true;
			levelRadioButtons[1].checked = false;
			localStorage.clear();
			
		}
		
		function assert(testName, bool){
			var newParaTag = document.createElement("p");
			var newText = document.createTextNode(testName + ": " + bool.toString());
			newParaTag.appendChild(newText);
			testPop.appendChild(newParaTag);
		}
		
	// Testing Game Over
	
		// When food is gone
		
		function testFoodEatenGameOver(){
			startGame();
			foodList = [];
			assert(getFunctionName(), isGameOver() == true);
			endGame();
		}
		// Game Over popup should appear after this
		
		// When time remaining is 0
		function testTimeGoneGameOver(){
			startGame();
			timeRemaining = 0;	
			assert(getFunctionName(), isGameOver() == true);
			endGame();
		}
		
	// Testing High Score
	
		// Check if initially, high score is 0
		function testInitialHighScoreValue(){
			localStorage.clear();
			resetScore();
			assert("testInitialHighScoreValue-highScore", highScore == 0);
			assert("testInitialHighScoreValue-LevelOneHighScore", levelOneHighscore == 0);
			assert("testInitialHighScoreValue-LevelTwoHighScore", levelTwoHighscore == 0);
			localStorage.clear();
			resetScore();
		}
		
		// Check if high score for level one registers
		function testHighScoreValueLevel1(){
			localStorage.clear();
			resetScore();
			levelRadioButtons[0].checked = true;
			levelRadioButtons[1].checked = false;
			score = 100;
			getLevel();
			calculateHighScore();
			setHighScore();
			var highScoreText = highScorePara.innerHTML;
			assert(getFunctionName(), "High Score: 100" == highScoreText);
			localStorage.clear();
			resetScore();
		}
		
		// Check if high score for level two registers
		function testHighScoreValueLevel2(){
			localStorage.clear();
			resetScore();
			levelRadioButtons[0].checked = false;
			levelRadioButtons[1].checked = true;
			score = 200;
			getLevel();
			calculateHighScore();
			setHighScore();
			var highScoreText = highScorePara.innerHTML;
			assert(getFunctionName(), "High Score: 200" == highScoreText);
			localStorage.clear();
			resetScore();
		}
		
		// Check if high score for level one doesn't change because of a lower score
		function testLowerScoreHighScoreHasNotChangedLevel1(){
			localStorage.clear();
			resetScore();
			levelRadioButtons[0].checked = true;
			levelRadioButtons[1].checked = false;
			score = 400;
			getLevel();
			calculateHighScore();
			setHighScore();
			score = 100;
			
			getLevel();
			calculateHighScore();
			setHighScore();
			var highScoreText = highScorePara.innerHTML;
			assert(getFunctionName(), "High Score: 400" == highScoreText);
			localStorage.clear();
			resetScore();
		}
		
		// Check if high score for level two doesn't change because of a lower score
		function testLowerScoreHighScoreHasNotChangedLevel2(){
			localStorage.clear();
			resetScore();
			levelRadioButtons[0].checked = false;
			levelRadioButtons[1].checked = true;
			score = 300;
			getLevel();
			calculateHighScore();
			setHighScore();

			score = 100;
			getLevel();
			calculateHighScore();
			setHighScore();
			alert(level);
			var highScoreText = highScorePara.innerHTML;
			assert(getFunctionName(), "High Score: 300" == highScoreText);
			localStorage.clear();
			resetScore();
		}

		function testPauseButtonDoesFreezeBugAndTimer(){
			// Click pause button to see if all bugs have stopped.
			// Check to see that the timer has stopped.
			levelRadioButtons[0].checked = false;
			levelRadioButtons[1].checked = true;
			startGame();
			setTimeout(
				function() {
					pauseUnpause();
					var sampleBug = bugList[0];
					var sampleBugInitalX = sampleBug.bugX;
					var sampleBugInitalY = sampleBug.bugY;
					var initialTimeRemaining = timeRemaining;
					setTimeout(function(){
						var freezeBug = (sampleBugInitalX === sampleBug.bugX) && (sampleBugInitalY === sampleBug.bugY);
						assert("testPauseButtonDoesFreezeBug", freezeBug);
						var freezeTime = (initialTimeRemaining === timeRemaining);
						assert("testPauseButtonDoesFreezeTime", "timeRemaining: " + timeRemaining + " initial: " + initialTimeRemaining);
					}, (1000/FRAME_RATE)*3);
					endGame();
				}
				, 1000*3);
		}

		function startTest() {
			setup();
			testFoodEatenGameOver();
			testTimeGoneGameOver();
			testInitialHighScoreValue();	
			testHighScoreValueLevel1();
			testHighScoreValueLevel2();
			testLowerScoreHighScoreHasNotChangedLevel1();
			testLowerScoreHighScoreHasNotChangedLevel2();
			testPauseButtonDoesFreezeBugAndTimer();
			takeDown();	
		}
		
		testButtonToggle();
	}	
	
	testButton.onclick = testGame;
}