var grid = {
	score: 0,
	a: [],
	init: function () {
		this.score = 0;
		this.a = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
	},
	smoothness: function () {
		var smoothness = 0;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (this.a[i][j]) {
					if (i - 1 >= 0 && this.a[i - 1][j]) {
						smoothness -= Math.abs(Math.log(this.a[i][j]) - Math.log(this.a[i - 1][j]));
					}
					if (i + 1 <= 3 && this.a[i + 1][j]) {
						smoothness -= Math.abs(Math.log(this.a[i][j]) - Math.log(this.a[i + 1][j]));
					}
					if (j - 1 >= 0 && this.a[i][j - 1]) {
						smoothness -= Math.abs(Math.log(this.a[i][j]) - Math.log(this.a[i][j - 1]));
					}
					if (j + 1 <= 3 && this.a[i][j + 1]) {
						smoothness -= Math.abs(Math.log(this.a[i][j]) - Math.log(this.a[i][j + 1]));
					}
				}
			}
		}
		return smoothness;
	},
	monotonicity2: function () {
		var totals = [0, 0, 0, 0];

		//   up/down direction
		for (var i = 0; i < 4; j++) {
			var current = 0;
			var next = current + 1;
			while (next < 4) {
				while (next < 4 && !this.a[i][next]) {
					next++;
				}
				if (next >= 4) {
					next--
				}
				var currentValue = this.a[i][current] ?
					Math.log(this.a[i][current]) / Math.log(2) : 0;
				var nextValue = this.a[i][next] ?
					Math.log(this.a[i][next]) / Math.log(2) : 0;
				if (currentValue > nextValue) {
					totals[0] += nextValue - currentValue
				} else if (nextValue > currentValue) {
					totals[i] += currentValue - nextValue;
				}
				current = next;
				next++;
			}
		}

		// left/right direction
		for (var j = o; j < 4; j++) {
			var current = 0;
			var next = current + 1;
			while (next < 4) {
				while (next < 4 && !this.a[next][j]) {
					next++;
				}
				if (next >= 4) {
					next--
				}
				var currentValue = this.a[current][j] ?
					Math.log(this.a[current][j]) / Math.log(2) : 0;
				var nextValue = this.a[next][j] ?
					Math.log(this.a[next][j]) / Math.log(2) : 0;
				if (currentValue > nextValue) {
					totals[2] += nextValue - currentValue;
				} else if (nextValue > currentValue) {
					totals[3] += currentValue - nextValue;
				}
				current = next;
				next++;
			}
		}

		return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);
	},
	maxValue: function () {
		return Math.max.apply(null, this.a.map(Function.apply.bind(Math.max, null)));
	},
	availableCells: function () {
		var cells = [];
		var self = this;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (!this.a[i][j]) {
					cells.push({
						x: i,
						y: j
					});
				}
			}
		}
		return cells;
	},
	randomAvailableCell: function () {
		var cells = this.availableCells();

		if (cells.length) {
			return cells[Math.floor(Math.random() * cells.length)];
		}
	}
};

var newRecord = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

function display_array() {
	let i, j;
	var maxNumber = grid.maxValue();
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			if (grid.a[i][j] != 0) {
				if (grid.a[i][j] == maxNumber) {
					document.getElementById("d" + ((i * 4) + j)).innerHTML = "<div class='tile tile-" + grid.a[i][j] + "'><span class='max-tile'>max</span><div class='tile-inner'>" + grid.a[i][j] + "</div></div>";
				} else {
					document.getElementById("d" + ((i * 4) + j)).innerHTML = "<div class='tile tile-" + grid.a[i][j] + "'><div class='tile-inner'>" + grid.a[i][j] + "</div></div>";
				}
			} else {
				document.getElementById("d" + ((i * 4) + j)).innerHTML = "";
			}
			if (newRecord[i][j] == 1) {
				document.getElementById("d" + ((i * 4) + j)).innerHTML = "<div class='tile tile-" + grid.a[i][j] + "'><span class='new-tile'>new</span><div class='tile-inner'>" + grid.a[i][j] + "</div></div>";
			}
		}
	}
}

function isFull(t) {
	for (let i = 0; i < 4; i++)
		for (let j = 0; j < 4; j++) {
			if (t[i][j] == 0) {
				return false;
			}
		}
	return true;
}

function show(t) {
	for (let i = 0; i < 4; i++) {
		console.log(t[i]);
	}
}

function canLeft(t) { //the left element of this element is 0 or equal to this element,return true
	for (let i = 0; i < 4; i++)
		for (let j = 1; j < 4; j++)
			if (t[i][j] != 0)
				if (t[i][j - 1] == 0 || t[i][j] == t[i][j - 1])
					return true;
	return false;
}

function canRight(t) {
	for (let i = 0; i < 4; i++)
		for (let j = 0; j < 3; j++)
			if (t[i][j] != 0)
				if (t[i][j + 1] == 0 || t[i][j] == t[i][j + 1])
					return true;
	return false;
}

function canUp(t) {
	for (let i = 1; i < 4; i++)
		for (let j = 0; j < 4; j++)
			if (t[i][j] != 0)
				if (t[i - 1][j] == 0 || t[i][j] == t[i - 1][j])
					return true;
	return false;
}

function canDown(t) {
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 4; j++)
			if (t[i][j] != 0)
				if (t[i + 1][j] == 0 || t[i][j] == t[i + 1][j])
					return true;
	return false;
}

function left(t, i) {
	let len = t[i].length;
	for (j = 0; j < len - 1; j++) {
		if (t[i][j] == 0 && t[i][j + 1] != 0) {
			temp = t[i][j];
			t[i][j] = t[i][j + 1];
			t[i][j + 1] = temp;
			left(t, i);
		}
	}
}

function right(t, i) {
	let len = t[i].length;
	for (j = len - 1; j > 0; j--) {
		if (t[i][j] == 0 && t[i][j - 1] != 0) {
			temp = t[i][j];
			t[i][j] = t[i][j - 1];
			t[i][j - 1] = temp;
			right(t, i);
		}
	}
}

function up(t, j) {
	let len = t[j].length;
	for (i = 0; i < len - 1; i++) {
		if (t[i][j] == 0 && t[i + 1][j] != 0) {
			temp = t[i][j];
			t[i][j] = t[i + 1][j];
			t[i + 1][j] = temp;
			up(t, j);
		}
	}
}

function down(t, j) {
	let len = t[j].length;
	for (i = len - 1; i > 0; i--) {
		if (t[i][j] == 0 && t[i - 1][j] != 0) {
			temp = t[i][j];
			t[i][j] = t[i - 1][j];
			t[i - 1][j] = temp;
			down(t, j);
		}
	}
}

function combineleft(a, i) {
	let len = a[i].length;
	for (let j = 0; j < len - 1; j++) {
		if (a[i][j] == a[i][j + 1]) {
			a[i][j] *= 2;
			a[i][j + 1] = 0;
			grid.score += a[i][j];
			left(a, i);
		}
	}
}

function combineright(a, i) {
	let len = a[i].length;
	for (let j = len - 1; j > 0; j--) {
		if (a[i][j] == a[i][j - 1]) {
			a[i][j] *= 2;
			a[i][j - 1] = 0;
			grid.score += a[i][j];
			right(a, i);
		}
	}
}

function combineup(a, j) {
	let len = a[j].length;
	for (let i = 0; i < len - 1; i++) {
		if (a[i][j] == a[i + 1][j]) {
			a[i][j] *= 2;
			a[i + 1][j] = 0;
			grid.score += a[i][j];
			up(a, j);
		}
	}
}

function combinedown(a, j) {
	let len = a[j].length;
	for (let i = len - 1; i > 0; i--) {
		if (a[i][j] == a[i - 1][j]) {
			a[i][j] *= 2;
			a[i - 1][j] = 0;
			grid.score += a[i][j];
			down(a, j);
		}
	}
}

function moveLeft(a) {
	for (let i = 0; i < 4; i++) {
		left(a, i);
		combineleft(a, i);
	}
}

function moveRight(a) {
	for (let i = 0; i < 4; i++) {
		right(a, i);
		combineright(a, i);
	}
}

function moveUp(a) {
	for (let j = 0; j < 4; j++) {
		up(a, j);
		combineup(a, j);
	}
}

function moveDown(a) {
	for (let j = 0; j < 4; j++) {
		down(a, j);
		combinedown(a, j);
	}
}




function addnew(t) {
	if (isFull(t)) {
		return;
	}
	newRecord = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
	while (true) {
		let i = grid.randomAvailableCell().x;
		let j = grid.randomAvailableCell().y;
		if (t[i][j] == 0) {
			t[i][j] = Math.random() < 0.9 ? 2 : 4;
			newRecord[i][j] = 1;
			break;
		}
	}
}

function addTwoNew(t) {
	if (isFull(t)) {
		return;
	}
	newRecord = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
	while (true) {
		let i = grid.randomAvailableCell().x;
		let j = grid.randomAvailableCell().y;
		if (t[i][j] == 0) {
			t[i][j] = Math.random() < 0.9 ? 2 : 4;
			newRecord[i][j] = 1;
			break;
		}
	}
	while (true) {
		let i = grid.randomAvailableCell().x;
		let j = grid.randomAvailableCell().y;
		if (t[i][j] == 0) {
			t[i][j] = Math.random() < 0.9 ? 2 : 4;
			newRecord[i][j] = 1;
			break;
		}
	}
}

function updataBestScore(bestScore) {
	document.getElementsByClassName("best-container")[0].textContent = bestScore;
}

function newGame() {
	grid.init();
	addTwoNew(grid.a);
	display_array();
	document.getElementsByClassName("score-container")[0].textContent = 0;
}

function isGameOver(t) {
	if (!isFull(t)) {
		return false;
	}
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (j < 3) {
				if (t[i][j] == t[i][j + 1]) {
					return false;
				}
			}
			if (i < 3) {
				if (t[i][j] == t[i + 1][j]) {
					return false;
				}
			}
		}
	}
	return true;
}


var smoothness = function (a) {
	var smoothness = 0;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (a[i][j]) {
				if (i - 1 >= 0 && a[i - 1][j]) {
					smoothness -= Math.abs(Math.log(a[i][j]) - Math.log(a[i - 1][j]));
				}
				if (i + 1 <= 3 && a[i + 1][j]) {
					smoothness -= Math.abs(Math.log(a[i][j]) - Math.log(a[i + 1][j]));
				}
				if (j - 1 >= 0 && a[i][j - 1]) {
					smoothness -= Math.abs(Math.log(a[i][j]) - Math.log(a[i][j - 1]));
				}
				if (j + 1 <= 3 && a[i][j + 1]) {
					smoothness -= Math.abs(Math.log(a[i][j]) - Math.log(a[i][j + 1]));
				}
			}
		}
	}
	return smoothness;
}

var monotonicity2 = function (a) {
	var totals = [0, 0, 0, 0];

	for (var i = 0; i < 4; i++) {
		var current = 0;
		var next = current + 1;
		while (next < 4) {
			while (next < 4 && !a[i][next]) {
				next++;
			}
			if (next >= 4) {
				next--
			}
			var currentValue = a[i][current] ?
				Math.log(a[i][current]) / Math.log(2) : 0;
			var nextValue = a[i][next] ?
				Math.log(a[i][next]) / Math.log(2) : 0;
			if (currentValue > nextValue) { //4321、2332、1231、1371,1717 
				totals[0] += nextValue - currentValue; // totals[0] = -3 ,totals[0] = -1，totals[0] = -1，totals[0] = -6， totals[0] = -6 //递减的度 
			} else if (nextValue > currentValue) { //  4321、2332、1231、1371, 1717
				totals[1] += currentValue - nextValue;  // totals [1] = 0 ,totals[1] = -1, totals[1] = -2, totals[1] = -6, totals[0] = -6   //递增的度
			}
			current = next;
			next++;
		}
	}

	//返回Math.max(totals[0], totals[1]), 越接近0代表此行越单调，越大代表此行越不单调

	for (var j = 0; j < 4; j++) {
		var current = 0;
		var next = current + 1;
		while (next < 4) {
			while (next < 4 && !a[next][j]) {
				next++;
			}
			if (next >= 4) {
				next--
			}
			var currentValue = a[current][j] ?
				Math.log(a[current][j]) / Math.log(2) : 0;
			var nextValue = a[next][j] ?
				Math.log(a[next][j]) / Math.log(2) : 0;
			if (currentValue > nextValue) {
				totals[2] += nextValue - currentValue;
			} else if (nextValue > currentValue) {
				totals[3] += currentValue - nextValue;
			}
			current = next;
			next++;
		}
	}

	return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);
}


var maxValuie = function (a) {
	return Math.max.apply(null, a.map(Function.apply.bind(Math.max, null)));
}

var availableCells = function (a) {
	console.log(a);
	var cells = [];
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (!a[i][j]) {
				cells.push({
					x: i,
					y: j
				});
			}
		}
	}
	return cells;
}

var randomAvailableCell = function (a) {
	var cells = availableCells(a);

	if (cells.length) {
		return cells[Math.floor(Math.random() * cells.length)];
	}
}


function eval(a){
	var emptyCells = availableCells(a).length;

	var smoothWeight = 0.1, //平滑性
		mono2Weight  = 1.0, //单调性
		emptyWeight  = 2.7, //空格数
		maxWeight    = 1.0;

	return smoothness(a) * smoothWeight
		+  monotonicity2(a) * mono2Weight
		+  Math.log(emptyCells) * emptyWeight
		+  maxValuie(a) * maxWeight;
}



/*随机数测试
var total = [0,0,0,0];
for(let i = 0; i <1000;i++){
	var num = Math.floor(Math.random()*4);
	switch(num){
		case 0:total[0]++;break;
		case 1:total[1]++;break;
		case 2:total[2]++;break;
		case 3:total[3]++;break;
	}
	direction = num==0?"l":num==1?"r":num==2?"u":"d";
	//console.log(direction);
}
console.log(total);
*/