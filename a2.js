window.onload = function() {
	var frameRate = 10;
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
		var bugProbability = Math.random();
		if (bugProbability < 0.3){
			bugType = "green";
			if (level === 1) {
				bugSpeed = 150;
			} else {
				bugSpeed = 200;
			}
		} else if (bugProbability < 0.6) {
			bugType = "yellow";
			if (level === 1) {
				bugSpeed = 75;
			} else {
				bugSpeed = 100;
			}
		} else {
			bugType = "orange";
			if (level === 1) {
				bugSpeed = 60;
			} else {
				bugSpeed = 80;
			}
		}
		var bug = {
			bugType: bugType,
			bugSpeed: bugSpeed,
			bugX: bugX,
			bugY: bugY
		};
		return bug;
	}
	
	var makeFood = function(foodX, foodY) {
		var foodTypes = ["apple", "orange", "banana"];
		var random = Math.floor(3*Math.random());
		var food = {
			foodType: foodTypes[random],
			foodX: foodX,
			foodY: foodY
		};
		return food;
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
		startGame();
	}

	var drawBugs = function() {
		setInterval(
			function(){
				var bugX = 10 + 380 * Math.random();
				var bugY = 0;
				var bug = makeBug(bugX, bugY);
				bugList.push(bug);
				drawBug(bug);	
			}, 1000+Math.random()*2000
		);
	}
	
	function reDrawObjects(){
		setInterval(
			function(){
				viewPortCanvasClear();
				for(i=0; i<bugList.length; i++){
					moveAndDrawBug(bugList[i]);
				}
				drawFoods();
			}, 1000/frameRate
		);
	}
	
	var createFoods = function(){
		var food;
		var i = 0;
		var foodX;
		var foodY;
		while(i!=5){
			foodX = 40+i*80;
			foodY = 550;
			food = makeFood(foodX, foodY);
			foodList.push(food); 
			drawFood(food);
			i++;
		}

	}
	
	function drawFoods(){
		for(i=0; i<foodList.length; i++){
			drawFood(foodList[i]);
		}
	}
	
	function moveAndDrawBug(bug){
		var a;
		var b;
		var deltaX;
		var deltaY;
		var distance;
		var minDistance;
		var food;
		var foodX;
		var foodY;
		
		if(bug.bugX<80&&foodList[0]!==NaN){
			food = foodList[0];
		}
		else if(bug.bugX<160&&foodList[1].foodType!="noType"){
			food = foodList[1];
		}
		else if(bug.bugX<240&&foodList[2].foodType!="noType"){
			food = foodList[2];
		}
		else if(bug.bugX<320&&foodList[3].foodType!="noType"){
			food = foodList[3];
		}
		else if(foodList[4].foodType!="noType"){
			food = foodList[4];
		}
		else{
			endGame(0);
		}
		
		// We do this so that foodX/foodY doesn't suddenly change in between calculations
		foodX = food.foodX;
		foodY = food.foodY;
		
		deltaX = foodX-bug.bugX;
		deltaY = foodY-bug.bugY;
		distance = Math.sqrt(Math.pow((deltaX),2) + Math.pow(deltaY,2));
		
		if(distance<20){
			var indexFood = foodList.indexOf(food);
			var indexBug = bugList.indexOf(bug);
			food.foodType = "noType";
			bugList.splice(indexBug,1,NaN);
		}
		else{
			bug.bugX += (((deltaX)/distance)*bug.bugSpeed)/frameRate;
			bug.bugY += (((deltaY)/distance)*bug.bugSpeed)/frameRate;	
			drawBug(bug);	
		}
	}
	
	
	/* Helper Functions */
	
	function drawBug(bugObject){
		bugX = bugObject.bugX;
		bugY = bugObject.bugY;
		/* Should check bugType here and draw bug accordingly */
		if(bugObject.bugType=="green"){
			drawBug1(viewPortContext, bugX, bugY);
		}
		else if(bugObject.bugType=="yellow"){
			drawBug2(viewPortContext, bugX, bugY);
		}
		else{
			drawBug3(viewPortContext, bugX, bugY);
		}
	}
	
	function drawFood(food){
		if(food.foodType=="apple"){
			drawApple(viewPortContext, food.foodX, food.foodY);
		}
		else if(food.foodType=="orange"){
			drawOrange(viewPortContext, food.foodX, food.foodY);
		}
		else if(food.foodType=="banana"){
			drawBanana(viewPortContext, food.foodX, food.foodY);
		}	
	}
	
	function rotateBug(bug, deltaX, deltaY){
			
	}
	
	/* End of Helper Functions */

	function startGame() {
        /* make a sound to start the game and maybe some other things? */
        createFoods();
        drawBugs();
        reDrawObjects();
	}

	function pauseUnpause(){
	        /* If game is paused, resume. Otherwise pause. */
	}

	function endGame(score){
	        /* When the timer hits 0, this should be called to end the game */
	        alert("Your score is: "+score+"!");
	        startBackButtonOnclick();
	}

	function animate(){
	        /* Use this to change the frame of the game per how-ever-many milliseconds to animate game */
	}
	
	/* Bug and Food Canvases */
	
	function drawApple(canvas, x, y){
		drawCircle(canvas, x, y, "Red");	
		drawLeaves(canvas, x, y);
		drawSmiley(canvas, x, y, 4);
	}
	
	function drawOrange(canvas, x, y){
		drawCircle(canvas, x, y, "Orange");		
		drawLeaves(canvas, x, y);
		drawSmiley(canvas, x, y, 4);
		
	}
	
	function drawBanana(canvas, x, y){
		drawBananaBody(canvas, x, y);
		drawBananaLines(canvas, x, y);
	}
	
	function drawBug1(canvas, x, y){
		drawBugGeneral(canvas, x, y, "Green");
	}
	
	function drawBug2(canvas, x, y){
		drawBugGeneral(canvas, x, y, "Black");
		drawBugWings(canvas, x, y);
	}
	
	
	function drawBug3(canvas, x, y){
		drawBugGeneral(canvas, x, y, "Orange");
	}
	
	/* More Helper Functions */
	
	function drawBugLegs(canvas, x, y){
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
		canvas.strokeStyle = "Black";
		canvas.stroke();
	}
	
	function drawBugWings(canvas, x, y){
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
	}
	
	function drawBugGeneral(canvas, x, y, color){
		drawBugLegs(canvas, x, y);
		if(color=="Black"){
			colorSecond = "Yellow";
		}
		else{
			colorSecond = color;
		}
		
		canvas.scale(0.5, 1);
		canvas.beginPath();
		canvas.arc(x*2,y,6,0,2*Math.PI);
		canvas.fillStyle = color;
		canvas.fill();
		canvas.strokeStyle = color;
		canvas.stroke();
		
		canvas.beginPath();
		canvas.scale(2, 1);
		canvas.arc(x,y+11,5,0,2*Math.PI)
		canvas.fillStyle = colorSecond;
		canvas.fill();
		canvas.strokeStyle = colorSecond;
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-9,3,0,2*Math.PI)
		canvas.fillStyle = colorSecond;
		canvas.fill();
		canvas.strokeStyle = colorSecond;
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-15,3,0,2*Math.PI)
		canvas.fillStyle = color;
		canvas.fill();
		canvas.strokeStyle = color;
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(x,y-21,3,0,2*Math.PI)
		canvas.fillStyle = colorSecond;
		canvas.fill();
		canvas.strokeStyle = colorSecond;
		canvas.stroke();
		
		drawSmiley(canvas, x, y+10, 2)
	}
	
	function drawBananaLines(canvas, x, y){
		canvas.beginPath();
		canvas.arc(x+2,y-2,8,0.5,4);
		canvas.strokeStyle = "black";
		canvas.stroke();
	}
	
	function drawCircle(canvas, x, y, color){
		canvas.beginPath();
		canvas.arc(x,y,9,0,2*Math.PI);
		canvas.fillStyle = color;
		canvas.fill();
		canvas.strokeStyle = color;
		canvas.stroke();
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
	
	function drawBananaBody(canvas, x, y){
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
	}
	
	
	/* End of More Helper Functions */

	startButton.onclick = startBackButtonOnclick;
	backButton.onclick = startBackButtonOnclick;
}