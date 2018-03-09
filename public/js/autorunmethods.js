//调用多线程跑结果?

/*createMethodsFromFile:传入url，从中get数据, 数据格式符合规定
[
    {
        "name": "path_1",
        "steps":[37,38,39,39,40,37,39,39,40,40,37]
    },
    {
        "name": "path_2",
        "steps":[39,38,39,39,40,37,38,39,38]
    },
    {
        "name": "path_3",
        "steps":[38,38,39,39,40,37,39,39,40,40,38]
    }
]*/
function createMethodsFromFile(url, type) {
    var JSONFile = new readJSONFile(url, type); //异步对象

    var timer = setInterval(() => {
        if (JSONFile != "undefined") {
            clearInterval(timer);
            var methods = JSONFile.getMethods();
            console.log(methods);
            autoRunFromFile(methods.methodNames[0], methods.methodSteps[0]); //调用autoRunFromFile，来更新dom
        }
    }, 200); //每200ms判断一次异步对象是否创建成功
}


//传入步骤数组
function autoRunFromFile(methodName, methodStep) {
    var name = methodName;
    console.log("方法名" + name);
    grid.init();
    addnew();
    addnew();
    display_array();
    for (let i = 0; i < methodStep.length; i++) {

        switch (methodStep[i]) {
            case 37:
                {
                    if (canLeft()) {
                        for (let i = 0; i < 4; i++)
                            left(grid.a, i);
                        for (let i = 0; i < 4; i++)
                            combineleft(grid.a, i);
                        addnew();
                    }
                    display_array();
                    break;
                }
            case 39:
                {
                    if (canRight()) {
                        for (let i = 0; i < 4; i++)
                            right(grid.a, i);
                        for (let i = 0; i < 4; i++)
                            combineright(grid.a, i);
                        addnew();
                    }
                    display_array();
                    break;
                }
            case 38:
                {
                    if (canUp()) {
                        for (let j = 0; j < 4; j++)
                            up(grid.a, j);
                        for (let j = 0; j < 4; j++)
                            combineup(grid.a, j);
                        addnew();
                    }
                    display_array();
                    break;
                }
            case 40:
                {
                    if (canDown()) {
                        for (let j = 0; j < 4; j++)
                            down(grid.a, j);
                        for (let j = 0; j < 4; j++)
                            combinedown(grid.a, j);
                        addnew();
                    }
                    display_array();
                    break;
                }
            default:
                alert("steps[" + i + "] error");
                break;
        }
    }
}

/*
function asnyc(url) {
    return new Promise(function(resolve, reject){
      var xml = new XMLHttpRequest();
      xml.open('GET', url, true);
      xml.onload = resolve;
      xml.onerror = reject;
      xml.send();
    } );
}

asnyc('http://127.0.0.1:8081/next_direction').then();
*/

function oneStepFromGet(url, type) {
    var asnycObj = new readJSONFile(url, type); //异步对象
    console.log(asnycObj);
    var loop = function(){
        if (asnycObj.ajax.responseData) {
            console.log("shujuzhongyudaole");
            clearTimeout(timer);
            console.log(asnycObj.ajax.responseData);
            var responseObj = JSON.parse(asnycObj.ajax.responseData);
            console.log(responseObj.direction);
            //对接受到的方向进行处理，再发送处理之后的棋盘状态
            sendGridStatus("http://127.0.0.1:8081/current_status","POST");
        } else {
            clearTimeout(timer);
            timer = setTimeout(loop, 10);
        }
    }
    
    var timer = setTimeout(loop, 10); 
    return asnycObj;
}

function sendGridStatus(){
    ajax('http://127.0.0.1:8081/current_status',function(data){
        console.log(data);
        console.log(typeof(data));
    },function(){},'POST');
}

