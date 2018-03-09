window.onload = function () {
	grid.init();
	addTwoNew(grid.a);
	var storageManager = new LocalStorageManager();
	updataBestScore(storageManager.getBestScore());
	display_array();
}

document.addEventListener("keyup", function (e) {
	if (e.keyCode == 37) //left
	{
		if (canLeft(grid.a)) {
			moveLeft(grid.a);
			addnew(grid.a);
		}
		display_array();
	}
	if (e.keyCode == 39) //right
	{
		if (canRight(grid.a)) {
			moveRight(grid.a);		
			addnew(grid.a);
		}
		display_array();
	}
	if (e.keyCode == 38) //up
	{
		if (canUp(grid.a)) {
			moveUp(grid.a);				
			addnew(grid.a);
		}
		display_array();
	}
	if (e.keyCode == 40) //down
	{
		if (canDown(grid.a)) {
			moveDown(grid.a);
			addnew(grid.a);
		}
		display_array();
	}


	if(e.keyCode == 73){ //i
		alert("73");
		runAI(grid.a);
	}





	document.getElementsByClassName("score-container")[0].textContent = grid.score;

	if (isGameOver(grid.a)) {
		alert("GameOver!");
		var storageManager = new LocalStorageManager();
		var bestScore = storageManager.getBestScore();
		if (bestScore == 0) {
			storageManager.setBestScore(grid.score);
			updataBestScore(storageManager.getBestScore());
		} else if (bestScore < grid.score) {
			storageManager.setBestScore(grid.score);
			updataBestScore(storageManager.getBestScore());
		}
		
	}
});



