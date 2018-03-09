function connectToBackend() {
    var sock = null;
    
    function connect() {
        if (sock !== null) {
            return;
        }

        console.log("正在连接中...");
        sock = new WebSocket('ws://localhost:4000/');

        sock.onopen = function () {
            console.log('连接成功!');
            sock.send("等待发布命令");
            send();
        };

        sock.onclose = function (e) {
            sock = null;
            console.log("断开连接");
            reconnect();
        };

        sock.onmessage = function (e) {
            // console.log("收到消息" + e.data);
            // console.log("消息类型：" + typeof(e.data)); //string
            var j = JSON.parse(e.data);
            // "j"的结构为：{
            //     replay: false[true],
            //     actionList: ""
            // }
            if (j.replay == false) {
                if (j.actionList == "r" || j.actionList == "l" || j.actionList == "u" || j.actionList == "d") {
                    // console.log(j.actionList);
                    goOnestep(j.actionList);
                    send();
                } else if (j.actionList == "-1"){
                    return;
                }
            }else {
                newGame();
                send();
            }
        };

        sock.onerror = function (e) {
            sock = null;
            reconnect();
        };
    }


    function reconnect() {
        setTimeout(connect, 1000);
    }

    function send() {
        var jStatus = {
            state:{
                grid:grid.a,
                score:grid.score,
                isOver:false
            },
            actionList: ["l", "r", "u", "d"]
        };
        if(isGameOver()){
            jStatus.state.isOver = true;
        }
        var msg = JSON.stringify(jStatus || {});
        sock.send(msg);
    }

    function goOnestep(dir) {
        // console.log(dir);
        switch (dir) {
            case "l":
                {
                    if (canLeft(grid.a)) {
                        moveLeft(grid.a);
                        addnew(grid.a);
                    }
                    display_array();
                    break;
                }
            case "r":
                {
                    if (canRight(grid.a)) {
                        moveRight(grid.a);
                        addnew(grid.a);
                    }
                    display_array();
                    break;
                }
            case "u":
                {
                    if (canUp(grid.a)) {
                        moveUp(grid.a)
                        addnew(grid.a);
                    }
                    display_array();
                    break;
                }
            case "d":
                {
                    if (canDown(grid.a)) {
                        moveDown(grid.a)
                        addnew(grid.a);
                    }
                    display_array();
                    break;
                }
            default:
                alert("error");
                break;
        }
        document.getElementsByClassName("score-container")[0].textContent = grid.score;
        
        if (isGameOver()) {
            //游戏结束判断是否更新最高分
            var storageManager = new LocalStorageManager();
            var bestScore = storageManager.getBestScore();
            if (bestScore == 0) {
                storageManager.setBestScore(grid.score);
                updataBestScore(bestScore);
            } else if (bestScore < grid.score) {
                storageManager.setBestScore(grid.score);
                updataBestScore(storageManager.getBestScore());
            }
            //alert("gameover!");
        }
    }
    connect();
};