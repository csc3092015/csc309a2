window.onload = function() {
	// GLOBAL VARIABLE
	var level;
	var score;
	var levelForm = document.getElementById("levelForm");
	var startPage = document.getElementById("startPage");
	var currentPage = 'startPage';
	var gamePage = document.getElementById("gamePage");
	var startButton = document.getElementById("startButton");
	var pauseButton = document.getElementById("pauseButton");
	var backButton = document.getElementById("backButton");
	var viewPortCanvas = document.getElementById("viewPortCanvas");
	var viewPortContext = viewPortCanvas.getContext("2d");
	var bugList = [];
	var foodList = [];

	// CONSTANT
	var FRAME_RATE = 10;
	var TOTAL_FOOD_NUMBER = 5;
	var OVERLAP_DISTANCE = 20;
	var DEFAULT_BUG_WIDTH = 10;
	var DEFAULT_BUG_HEIGHT = 40;
	var DEFAULT_FOOD_WIDTH = 10;
	var DEFAULT_FOOD_HEIGHT = 10;
	var FOOD_SPAWN_HEIGHT = viewPortCanvas.height - 50;
	var FOOD_TYPE_EATEN = "noType";
	var FOOD_TYPES = ["apple", "orange", "banana"];


	var viewPortCanvasClear = function() {
		viewPortContext.clearRect(0, 0, viewPortCanvas.width, viewPortCanvas.height);
	}


	function startGame() {
        /* make a sound to start the game and maybe some other things? */
        createFoods();
        createBugs();
        reDrawObjects();
	}

	function pauseUnpause(){
	        /* If game is paused, resume. Otherwise pause. */
	}

	function endGame(){
	        /* When the timer hits 0, this should be called to end the game */
	        alert("Your score is: " + score + "!");
	}

	function animate(){
	        /* Use this to change the frame of the game per how-ever-many milliseconds to animate game */
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
			startPage.style.display = 'none';
			gamePage.style.display = 'block';
			currentPage = 'gamePage';
			viewPortCanvasClear();
		} else {
			startPage.style.display = 'block';
			gamePage.style.display = 'none';
			currentPage = 'startPage';
		}
		startGame();
	}


	
	function reDrawObjects(){
		setInterval(
			function(){
				viewPortCanvasClear();
				for(i = 0; i < bugList.length; i++){
					moveAndDrawBug(bugList[i]);
				}
				drawFoods();
			}, 1000/FRAME_RATE
		);
	}


	function isGameOver() {
		if (foodList.length === 0) {
			return true;
		}
		return false;
	}
	

	
	function moveAndDrawBug(bug){
		var deltaX;
		var deltaY;
		var distance;
		var minDistance=10000;
		var minIndex;
		var food;
		var foodX;
		var foodY;

		for (var i = 0; i < foodList.length; i++) {
			if(foodList[i].foodType != FOOD_TYPE_EATEN){
				deltaX = Math.abs(foodList[i].foodX-bug.bugX);
				if(minDistance==10000||deltaX<minDistance){
					minDistance = Math.abs(foodList[i].foodX-bug.bugX);
					minIndex = i;
				}	
			}

		}
		
		if(minDistance==10000){
			endGame();
		}
		
		food = foodList[minIndex];
		
		// We do this so that foodX/foodY doesn't suddenly change in between calculations
		foodX = food.foodX;
		foodY = food.foodY;
		
		deltaX = foodX - bug.bugX;
		deltaY = foodY - bug.bugY;
		distance = Math.sqrt(Math.pow((deltaX), 2) + Math.pow(deltaY, 2));
		
		if(distance < OVERLAP_DISTANCE){
			var foodIndex = foodList.indexOf(food);
			var bugIndex = bugList.indexOf(bug);
			food.foodType = FOOD_TYPE_EATEN;
			if (bugIndex > -1) {
				bugList.splice(bugIndex, 1);	
			}
		}
		else{
			bug.bugX += (((deltaX)/distance)*bug.bugSpeed)/FRAME_RATE;
			bug.bugY += (((deltaY)/distance)*bug.bugSpeed)/FRAME_RATE;	
			drawBug(bug);	
		}
	}
	
	function drawFoods(){
		for(i=0; i<foodList.length; i++){
			drawFood(foodList[i]);
		}
	}
	/**************************************************************
	****        CREATE BUGS and FOOD 						*******
	***************************************************************/

	var createBugs = function() {
		setInterval(
			function(){
				var bugX = 10 + 380 * Math.random();
				var bugY = 0;
				var bug = makeBug(bugX, bugY);
				bugList.push(bug);
				drawBug(bug);	
			}, 1000 + Math.random() * 2000 // every 1-3 seconds
		);
	}
	
	var createFoods = function(){
		var food;
		var i = 0;
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
		while(i != TOTAL_FOOD_NUMBER){
			foodX = (i + 1) * spacing + i * 20;
			foodY = FOOD_SPAWN_HEIGHT;
			food = makeFood(foodX, foodY);
			foodList.push(food); 
			drawFood(food);
			i++;
		}

	}

	/**************************************************************
	****         MAKE BUGS and FOOD 						*******
	***************************************************************/
	var bugObject = function(bugX, bugY, bugType, bugSpeed, bugScore) {
		this.bugX = bugX;
		this.bugY = bugY;
		this.bugType = bugType;
		this.bugSpeed = bugSpeed;
		this.bugScore = bugScore;
		this.bugClosestFood;
		this.bugClosestFoodDistance;
		this.setClosestFood = function(){
			var deltaX;
			var deltaY;
			var distance;
			var food;;
			for (var i = 0; i < foodList.length; i++) {
				food = foodList[i];
				deltaX = food.foodX - this.bugX;
				deltaY = food.foodY - this.bugY;
				distance = Math.sqrt(Math.pow((deltaX), 2) + Math.pow(deltaY, 2));
				if (typeof minDistance === "undefined") {
					this.bugClosestFoodDistance = distance;
					this.bugClosestFood = food;
				} else if (minDistance > distance) {
					this.bugClosestFoodDistance = distance;
					this.bugClosestFood = food;
				}
			}
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
	
	var makeFood = function(foodX, foodY) {
		var random = Math.floor(FOOD_TYPES.length * Math.random());
		var food = {
			foodType: FOOD_TYPES[random],
			foodX: foodX,
			foodY: foodY
		};
		return food;
	}

	/**************************************************************
	****         DRAW BUG and FOOD 						*******
	***************************************************************/

	function drawBug(bugObject){
		drawBugGeneral(bugObject);
		if(bugObject.bugType === "red"){
			// somehow the red is mutated so they have wings!
			drawBugWings(bugObject);
		}
	}
	
	function drawFood(food){
		if(food.foodType=="apple"){
			drawApple(food);
		}
		else if(food.foodType=="orange"){
			drawOrange(food);
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
	
	function drawBanana(banana){
		drawBananaBody(banana);
		drawBananaLines(banana);
	}
	
	/**************************************************************
	****         DRAW HELPER with Object					*******
	***************************************************************/

	// function name specify which object it is drawing so the argument should be the object itself
	
	function drawBugWings(bugObject){
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
	}
	
	function drawBugGeneral(bugObject){
		var x = bugObject.bugX;
		var y = bugObject.bugY;
		var color = bugObject.bugType;
		drawBugLegs(bugObject);
		if(color=="black"){
			colorSecond = "yellow";
		}
		else{
			colorSecond = color;
		}
		
		viewPortContext.scale(0.5, 1);
		viewPortContext.beginPath();
		viewPortContext.arc(x*2,y,6,0,2*Math.PI);
		viewPortContext.fillStyle = color;
		viewPortContext.fill();
		viewPortContext.strokeStyle = color;
		viewPortContext.stroke();
		
		viewPortContext.beginPath();
		viewPortContext.scale(2, 1);
		viewPortContext.arc(x,y+11,5,0,2*Math.PI)
		viewPortContext.fillStyle = colorSecond;
		viewPortContext.fill();
		viewPortContext.strokeStyle = colorSecond;
		viewPortContext.stroke();
		
		viewPortContext.beginPath();
		viewPortContext.arc(x,y-9,3,0,2*Math.PI)
		viewPortContext.fillStyle = colorSecond;
		viewPortContext.fill();
		viewPortContext.strokeStyle = colorSecond;
		viewPortContext.stroke();
		
		viewPortContext.beginPath();
		viewPortContext.arc(x,y-15,3,0,2*Math.PI)
		viewPortContext.fillStyle = color;
		viewPortContext.fill();
		viewPortContext.strokeStyle = color;
		viewPortContext.stroke();
		
		viewPortContext.beginPath();
		viewPortContext.arc(x,y-21,3,0,2*Math.PI)
		viewPortContext.fillStyle = colorSecond;
		viewPortContext.fill();
		viewPortContext.strokeStyle = colorSecond;
		viewPortContext.stroke();
		
		drawSmiley(x, y+10, 2)
	}

	function drawBugLegs(bugObject){
		var x = bugObject.bugX;
		var y = bugObject.bugY;
		viewPortContext.beginPath();
		viewPortContext.moveTo(x+6,y);
		viewPortContext.lineTo(x-6,y);
		viewPortContext.moveTo(x+6,y+4);
		viewPortContext.lineTo(x-6,y+4);
		viewPortContext.moveTo(x+6,y-4);
		viewPortContext.lineTo(x-6,y-4);
		viewPortContext.moveTo(x+6,y-8);
		viewPortContext.lineTo(x-6,y-8);
		viewPortContext.moveTo(x+6,y-12);
		viewPortContext.lineTo(x-6,y-12);
		viewPortContext.moveTo(x+6,y-16);
		viewPortContext.lineTo(x-6,y-16);
		viewPortContext.moveTo(x+6,y-20);
		viewPortContext.lineTo(x-6,y-20);
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
}