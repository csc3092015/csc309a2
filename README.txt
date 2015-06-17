This is just a draft README, it is only for recording purpose. Before submission, this will be replaced by a PDF file!

Name: Jiecao Wang Student #: 997974811 CDF: g3wangjj
Name: Elio Tanke Student #: 999629282 CDF: c5tankee

______________________________________________________________________________
Game Title: Tap Tap Bug
______________________________________________________________________________
Basics: Tap the bugs before they eat all the food. You have 60 seconds.
______________________________________________________________________________
Core Features:

Bug    Points for Killing    Speed Level 1    Speed Level 2    Probability of Appearing
Orange 1                     60               80	       0.3
Red    3                     75               100	       0.3
Black  5                     150              200	       0.4

You may pause during the game
Timer: 60 seconds countdown
5 Food Items randomly selected from apples, oranges, and bananas
______________________________________________________________________________
Rules:

The game ends when you run out of time or the bugs eat all the food.
______________________________________________________________________________
Challenges: 

1. Try to get more than 100 points!
2. Prevent the bugs from eating any of your food.
______________________________________________________________________________
Design:

—Bugs—

Bugs are drawn using canvas, with circles, ovals (via circles and scaling), and lines. Bugs are created every 1 to 3 seconds and are moved every 60th of a second. Movement is described below. They are created with multiple properties: type, speed, food target, and score. The type is the color and chosen randomly with certain probabilities. The speed depends on the type. The food target is the closest food determined by the distance function. If the food is eaten by another bug, the food target changes. The score is the score gained by the player when the bug is killed.  


—Food—

The food is drawn using circles and lines. This was namely done through trial and error to make things look good. They are positioned randomly in the second half of the canvas, using the math modules random function and multiplying the function by the range it can exist in and adding the minimum value. Food disappears when a bug is within a specific radius of the food. The bug will disappear simultaneously. 


—Movement—

Every 60th of a second, we redraw the food and bugs. However, we also update the bugs positions so that they move to the closest food to them. This is done using the distance formula. We go through each bug in an array, and update their position to move toward the nearest food. 

The formula is: 

movement of X = (bug speed)*(change in X)/(distance*(frame rate))
movement of Y = (bug speed)*(change in Y)/(distance*(frame rate))

These numbers are incremented to the X and Y coordinates of the bug every 60th of a second. 

—Timer—

We initially record the time that the game starts via the system time. Then, when we calculate the time elapsed (60 frames per second) by checking the system time again and subtracting it from the total 60 original seconds given. Because this is not an integer, we round this number down for display purposes and change the html element by getting its ID.

—Pause—

An event handler was used to detect when the button was pressed. It is designed not to function when the game is over.


When you click pause, bug creation is stopped (bugs are created on a random interval between 1 and 3 seconds), bugs stop being updated (for movement), and pause button is changed to play via get element by ID method.

When the game is paused and you click the play button, the game resumes by doing the following: It updates the “start time” to the current system time so the timer can adjust accordingly, it starts the timer again, it begins creating bugs again, and it begins moving the bugs again. Then the play button is changed back to pause via the same method as before.

—Tap—

An event handler is used to detect taps. When a tap is detected, the X and Y coordinates of the tap are recorded. Then, using the distance formula, we check if there are any bugs within the defined radius. To kill bugs, we also consider their shape, and as they are rectangular, we created 9 cases: 4 corners, 4 sides, and the bug’s body, where the distance depends on where the taps coordinates are.

When a bug dies, it fades out, and is removed from the bug list so it is not drawn again.

—Testing— 