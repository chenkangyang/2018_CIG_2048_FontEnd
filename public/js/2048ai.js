var AI = {
    score: 0,
    a: [],
    depth: 0,
    init: function () {
        this.score = 0;
        this.a = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        depth = 0;
    },
    cur: []
}


function copy(cur, a) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            a[i][j] = cur[i][j];
        }
    }
}

//search 之前要AI.init
function search(a) {
    AI.depth++;
    AI.a = a;
    AI.cur = AI.a;
    var miniLeft = 100000;
    var miniRight = 100000;
    var miniUp = 100000;
    var miniDown = 100000;
    //alpha < N < beta
    var beta = 100000; 
    var alpha = -100000; 
    var minimum;

    if (AI.depth >= 4) { //限制深度
        // console.log("depth:" + AI.depth);
        console.log("evalGrid:" + eval(AI.cur));
        return {
            'beta': eval(AI.cur),
            'direction': direction
        }
    }

    /***************************************************************/

    alpha = beta; //先设置alpha为此层期望值

    if (canLeft(AI.a)) {
        // console.log("canleft");
        moveLeft(AI.a);
        outer: 
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (AI.a[i][j] == 0) {
                    // AI.a[i][j] = Math.random() < 0.9 ? 2 : 4;
                    // console.log("新生成了:" + AI.a[i][j]);
                    for(let k = 0; k < 2; k++){
                        if(k){
                            AI.a[i][j] = 4;
                            minimum = search(AI.a);
                            AI.depth --;
                            copy(AI.cur, AI.a);
                            moveLeft(AI.a);
                            beta += minimum.beta * 0.1; //再计算生成4时的评估值和2时相加    
                        }
                        else{  //先计算生成2时的评估值
                            AI.a[i][j] = 2;
                            minimum = search(AI.a);
                            AI.depth --;
                            copy(AI.cur, AI.a);
                            moveLeft(AI.a);
                            beta = minimum.beta * 0.9;
                        }
                        console.log(beta);
                    }

                    if(beta < miniLeft){
                        miniLeft = beta;   //miniLeft为当前min节点选择beta中最小的
                    }

                    if(miniLeft <= alpha){
                        break outer;
                    }
                    // moveLeft(AI.a); //左移生成下一局面
                    // // console.log("下一次search:");
                    // // console.log(AI.a);
                    // // console.log("深度" + AI.depth);
                    // minimum = search(AI.a); //DFS深搜
                    // // console.log("深搜返回：")
                    // // console.log(minimum);
                    // //以下两行恢复此层的状态
                    // AI.depth--; 
                    // copy(AI.cur, AI.a); 
                    
                    // // moveLeft(AI.a); //左移生成下一局面
                    // // console.log("左移动后：" + AI.a);
                    

                    // if (minimum.beta < mimiLeft) {
                    //     //电脑选择使得玩家局面最坏的情况，更新当前beta为最小期望值 
                    //     mimiLeft = minimum.beta; 
                    // }
                    // if (miniLeft <= alpha) { //此处beta<=alpha时，剪枝
                    //     break outer;
                    // }
                }
            }
        }
    } else {
        mimiLeft = -100000;
    }
    beta = mimiLeft;
    direction = "l";
    copy(AI.cur, AI.a); //恢复本层循环的局面

    /**********************************************************/

    alpha = beta;

    if (canRight(AI.a)) {
        moveRight(AI.a);
        outer: 
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (AI.a[i][j] == 0) {
                    for(let k = 0; k < 2; k++){
                        if(k){
                            AI.a[i][j] = 4;
                            minimum = search(AI.a);
                            AI.depth --;
                            copy(AI.cur, AI.a);
                            moveRight(AI.a);
                            beta += minimum.beta * 0.1;
                        }
                        else{  
                            AI.a[i][j] = 2;
                            minimum = search(AI.a);
                            AI.depth --;
                            copy(AI.cur, AI.a);
                            moveRight(AI.a);
                            beta = minimum.beta * 0.9;
                        }
                    }
                    
                    if(beta < miniRight){
                        miniRight = beta;   
                    }

                    if(miniRight <= alpha){
                        break outer;
                    }

                }
            }
        }
    }
    else {
        miniRight = -100000;
    }
    if (miniRight > beta) {
        beta = miniRight;
        direction = "r";
    }
    copy(AI.cur, AI.a);

    /**********************************************************/

    alpha = beta;

    if (canUp(AI.a)) {
        moveUp(AI.a);
        outer: 
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (AI.a[i][j] == 0) {
                    for(let k = 0; k < 2; k++){
                        if(k){
                            AI.a[i][j] = 4;
                            minimum = search(AI.a);
                            AI.depth --;
                            copy(AI.cur, AI.a);
                            moveUp(AI.a);
                            beta += minimum.beta * 0.1;
                        }
                        else{  
                            AI.a[i][j] = 2;
                            minimum = search(AI.a);
                            AI.depth --;
                            copy(AI.cur, AI.a);
                            moveUp(AI.a);
                            beta = minimum.beta * 0.9;
                        }
                        //beta
                    }
                    
                    if(beta < miniUp){
                        miniUp = beta;   
                    }

                    if(miniUp <= alpha){
                        break outer;
                    }
                }
            }
        }
    }
    else {
        miniUp = -100000;
    }
    if (miniUp > beta) {
        beta = miniUp;
        direction = "u";
    }
    copy(AI.cur, AI.a);

    /**********************************************************/

    alpha = beta;

    if (canDown(AI.a)) {
        moveDown(AI.a);
        outer: 
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (AI.a[i][j] == 0) {
                    for(k = 0; k < 2; k++){
                        if(k){
                            AI.a[i][j] = 4;
                            minimum = search(AI.a);
                            AI.depth --;
                            copy(AI.cur, AI.a);
                            moveDown(AI.a);
                            beta += minimum.beta * 0.1;
                        }
                        else{
                            AI.a[i][j] = 2;
                            minimum = search(AI.a);
                            AI.depth --;
                            copy(AI.cur, AI.a);
                            moveDown(AI.a);
                            beta += minimum.beta * 0.9;
                        }
                    }
                    if (beta < miniDown) {
                        miniDown = beta;
                    }
                    if (beta <= alpha) {
                        break outer;
                    }
                }
            }
        }
    }
    else {
        miniDown = -100000;
    }
    if (miniDown > beta) {
        beta = miniDown;
        direction = "d";
    }
    copy(AI.cur, AI.a);

    //第一层时先随机走一个方向
    if (beta == -10000 && this.depth == 1) {
        var num = Math.floor(Math.random() * 4);
        direction = num == 0 ? "l" : num == 1 ? "r" : num == 2 ? "u" : "d";
    }

    return {
        'beta': beta,
        'direction': direction
    };
}


function runAI(a){
    AI.init();
    AI.a = a;
    AI.cur = AI.a;
    var timer = setInterval(function(){
        if(isGameOver(AI.a)) {
            alert("AI已死， 有事烧纸")
            clearTimeout(timer);
        }
        else{
            beta = 100000;
            AI.depth = 0;
            var options = search(AI.a);
            var direction = options.direction;
            console.log(direction);
            switch (direction) {
                case "l":
                    if (canLeft(grid.a)) {
                        moveLeft(grid.a);
                        addnew(grid.a);

                        moveLeft(AI.a);
                        addnew(AI.a);
                        AI.cur = AI.a;
                    }
                    display_array();
                    break;
                case "r":
                    if (canRight(grid.a)) {
                        moveRight(grid.a);
                        addnew(grid.a);

                        moveRight(AI.a);
                        addnew(AI.a);
                        AI.cur = AI.a;
                    }
                    display_array();
                    break;
                case "u":
                    if (canUp(grid.a)) {
                        moveUp(grid.a);
                        addnew(grid.a);

                        moveUp(AI.a);
                        addnew(AI.a);
                        AI.cur = AI.a;
                    }
                    display_array();
                    break;
                case "d":
                    if (canDown(grid.a)) {
                        moveDown(grid.a);
                        addnew(grid.a);

                        moveDown(AI.a);
                        addnew(AI.a);
                        AI.cur = AI.a;
                    }
                    display_array();
                    break;
            }
        }
    }, 3000)
}