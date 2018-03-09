function ajax(url, fnSuccess, fnFailed, type) {
    var oAjax = null;

    var successRet = {};
    function getAsynSuccessData(data){
        this.responseData = data;
    };

    var asynObj = getAsynSuccessData.bind(successRet);

    if (window.XMLHttpRequest) {
        oAjax = new XMLHttpRequest();
    } else {
        oAjax = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(type=='undefined') {
        type = 'GET';
    }
    oAjax.open(type, url, true);
    
    if(type == 'POST'){  //POST请求则发送棋盘当前状态
        oAjax.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        var current_status = {
            "status": grid.a
        };         
        oAjax.send(JSON.stringify(current_status));
    }
    else if(type=='GET'){
        oAjax.send(); //GET情况下不发送数据
    }
    
    oAjax.onreadystatechange = function () {
        if (oAjax.readyState == 4) {
            if (oAjax.status == 200) {
                fnSuccess(oAjax.responseText);
                // alert("success!");
                asynObj(oAjax.responseText);
            } else {
                if (fnFailed)
                    fnFailed(oAjax.status);
                // alert("failed...");
            }
        }
    };
    return successRet; //Object:{responseData: oAjax.responseText}
}

/*以下方法调用时要用timer判断是否undefined，即是否异步获取成功
为了不在回调函数中处理异步请求的值，而创建异步对象，
使用异步对象的方法之前要等待异步对象创建成功之后才可以*/
function readJSONFile(url, type) {
    this.url = url;
    this.ajax = ajax(this.url,function(data){},function(){},type);
}

/*
接口说明：
new异步对象：readJSONFile(url, type)
参数：
    type:GET请求时返回successRet(Object)
方法: getMethods   return {methodName, smethodSteps}
*/


readJSONFile.prototype.getMethods = function(){
    var JSONObj = JSON.parse(this.ajax.responseData);
    var methodNames = [];
    var methodSteps = new Array()
    for(let i = 0; i < JSONObj.length; i++){
        methodSteps[i] = new Array();
        methodNames.push(JSONObj[i].name);
        methodSteps[i] = JSONObj[i].steps;
    }
    return {
        methodNames:methodNames,
        methodSteps:methodSteps
    }
}

