//传入一个局面玩到死

function AI(grid) {
    this.grid = grid;
    this.depth = 0;
}

AI.prototype.eval = function (gird) {
    console.log("evalGrid:----------")
    console.log(grid);
    console.log("this.evalGrid:----------")
    console.log(this.grid)
    var emptyCells = availableCells(grid).length;
    console.log(emptyCells);

    var smoothWeight = 0.1,
        mono2Weight = 1.0,
        emptyWeight = 2.7,
        maxweight = 1.0;

    return smoothness(grid) * smoothWeight +
        monotonicity2(grid) * mono2Weight +
        Math.log(emptyCells) * emptyWeight +
        maxValue(grid) * maxweight;
};


AI.prototype.copy = function (grid, gridCopy) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            gridCopy[i][j] = grid[i][j];
        }
    }
}

//alpha 最好下界  beta最坏上界    某一结点beta小于alpha时，剪枝
AI.prototype.search = function (grid) {
    // var newAI = new AI(grid);
    console.log("当前局面：")
    console.log(newAI.grid);
    this.depth++;
    console.log("当前搜索深度：" + this.depth)
    var mimiLeft = 100000;
    var miniRight = 100000;
    var miniUp = 100000;
    var miniDown = 100000;
    var beta = 100000; //最坏结果的上界
    var alpha = -100000;
    var direction = 4;
    var minimum;

    var curGrid = new Array(); //保存当前状态

    for (let i = 0; i < 4; i++) {
        curGrid[i] = new Array();
        for (let j = 0; j < 4; j++) {
            curGrid[i][j] = grid[i][j];
        }
    }

    if (this.depth >= 4) { //限制深度
        console.log("depth:" + this.depth);
        console.log("grid:" + grid);
        return {
            'alpha': newAI.eval(grid),
            'direction': direction
        }
    }
    /***************************************************************/

    beta = alpha; //最坏结果的上界

    if (canLeft(grid)) {
        console.log("canleft")
        outer: for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] == 0) {
                    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
                    console.log("新生成了:" + grid[i][j]);
                    moveLeft(grid); //左移生成下一局面
                    console.log("下一次search:");
                    console.log(grid);
                    console.log("深度" + this.depth);
                    minimum = newAI.search(grid); //DFS深搜
                    console.log("深搜返回：")
                    console.log(minimum);
                    this.depth--; //DFS结束后恢复grid状态
                    moveLeft(grid); //左移生成下一局面
                    console.log("左移动后：" + grid);
                    newAI.copy(curGrid, grid); //每次产生新的随机数后，要恢复状态，进行下一次随机数的生成

                    if (minimum.alpha < mimiLeft) { //alpha为当前局面的期望值
                        mimiLeft = minimum.alpha; //电脑选择使得玩家局面最坏的情况
                    }
                    if (beta <= mimiLeft) { //此处beta<=alpha时，剪枝
                        break outer;
                    }
                }
            }
        }
    } else {
        mimiLeft = -100000;
    }
    //玩家在上下左右中选择最好的一个，作为下一步的方向。先设置为左方向的评估值，
    //若其他方向的评估值更大就设置为最大的那个
    alpha = mimiLeft;
    direction = "l";
    newAI.copy(curGrid, grid); //恢复本层循环的局面

    /**********************************************************/

    beta = alpha;

    if (canRight(grid)) {
        outer: for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] == 0) {
                    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
                    minimum = newAI.search(grid);
                    this.depth--;
                    moveRight(grid);
                    newAI.copy(curGrid, grid);

                    if (minimum.alpha < miniRight) {
                        miniRight = minimum.alpha;
                    }
                    if (beta <= miniRight) {
                        break outer;
                    }
                }
            }
        }
    }
    else {
        miniRight = -100000;
    }
    if (miniRight > alpha) {
        alpha = miniRight;
        direction = "r";
    }

    newAI.copy(curGrid, grid);

    /**********************************************************/

    beta = alpha;

    if (canUp(grid)) {
        outer: for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] == 0) {
                    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
                    minimum = newAI.search(grid);
                    this.depth--;
                    moveUp(grid);
                    this.copy(curGrid, grid);

                    if (minimum.alpha < miniUp) {
                        miniUp = minimum.alpha;
                    }
                    if (beta <= miniUp) {
                        break outer;
                    }
                }
            }
        }
    }
    else {
        miniUp = -100000;
    }
    if (miniUp > alpha) {
        alpha = miniUp;
        direction = "u";
    }

    newAI.copy(curGrid, grid);

    /**********************************************************/

    beta = alpha;

    if (canDown(grid)) {
        outer: for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] == 0) {
                    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
                    minimum = newAI.search(grid);
                    this.depth--;
                    moveDown(grid);
                    newAI.copy(curGrid, grid);

                    if (minimum.alpha < miniDown) {
                        miniDown = minimum.alpha;
                    }
                    if (beta <= miniDown) {
                        break outer;
                    }
                }
            }
        }
    }
    else {
        miniDown = -100000;
    }
    if (miniDown > alpha) {
        alpha = miniDown;
        direction = "d";
    }

    newAI.copy(curGrid, grid);



    if (alpha == -10000 && this.depth == 1) {
        var num = Math.floor(Math.random() * 4);
        direction = num == 0 ? "l" : num == 1 ? "r" : num == 2 ? "u" : "d";
    }

    return {
        'alpha': alpha,
        'direction': direction
    };
}

AI.prototype.run = function () {
    var newAI = new AI(this.grid);
    var self = this;
    console.log("运行AI时的局面：")
    console.log(self.grid)
    var timer = setInterval(function () {
        if (isGameOver(self.grid)) {
            clearInterval(timer);
        } else {
            this.depth = 0;
            beta = 100000;
            console.log(self);
            console.log(this);
            console.log("运行AI,传入局面：")
            console.log(self.grid)
            var option = newAI.search(self.grid);
            var direction = option.direction;
            console.log("获得方向：")
            console.log(direction);
            switch (direction) {
                case "l":
                    if (canLeft(grid.a)) {
                        moveLeft(grid.a);
                        addnew(grid.a);
                    }
                    display_array();
                    break;
                case "r":
                    if (canRight(grid.a)) {
                        moveRight(grid.a);
                        addnew(grid.a);
                    }
                    display_array();
                    break;
                case "u":
                    if (canUp(grid.a)) {
                        moveUp(grid.a);
                        addnew(grid.a);
                    }
                    display_array();
                    break;
                case "d":
                    if (canDown(grid.a)) {
                        moveDown(grid.a);
                        addnew(grid.a);
                    }
                    display_array();
                    break;
            }
        }
    }, 3000);
}