/// <reference path="../../All References.js" />
Modes.add("Modes/HTML/Tasks.html", "Task Organiser", function () {
}, function(){
});

var Task = new Object();
var _TaskLocal = new Object();
_TaskLocal.onWorker = false;
_TaskLocal.messages = new Array();

Task.create = function(name, file, object){
    document.getElementById("Task_Title").innerHTML = name;
    document.getElementById("Task_Progress_Bar").value = 0;
    document.getElementById("Task_Progress_Value").innerHTML = "0%";
    document.getElementById("Task_Output").innerHTML = "";
    if (_TaskLocal.onWorker) {
    	console.error("Cannot create a new Task when one is already working!");
    	return -1;
    }
    _TaskLocal.onWorker = true;
    var worker = new Worker(file);
    console.log(worker);
    //Start tick
    var interval = setInterval(Task.tick, 1000 / 100);
    worker.addEventListener('message', function(e){
    	var data = e.data;
    	switch(data.type){
    	    case "return":
    	        //Evaluate the rest of the statments
    	        var text;
    	        var el;
    	        var t;
    	        while (_TaskLocal.messages.length != 0) {
    	            _TaskLocal.printLine(_TaskLocal.messages.shift());
    	        }
    	        //Print Return statment
    	        var el = document.createElement("div");
    	        el.innerHTML = "Function Returned: <b>" + data.text + "</b>";
    	        var t = document.getElementById("Task_Output");
    	        t.insertBefore(el, t.childNodes[0]);
    	        document.getElementById("Task_Progress_Value").innerHTML = "100%";
    	        document.getElementById("Task_Progress_Bar").value = 100;
                //Clear everything
    	        clearInterval(interval);
    	        worker.terminate();
    	        _TaskLocal.onWorker = false;
    	        break;
    	    case "output":
    	        _TaskLocal.messages.push(data.text);
    	        break;
    	    case "update":
    	        document.getElementById("Task_Progress_Bar").value = data.text * 100;
    	        document.getElementById("Task_Progress_Value").innerHTML = Math.round(data.text * 1000) / 10 + "%";
    	        break;
    	    default:
    	        throw ReferenceError("Unknown Type");
    	        break;
    	}
    }, false);
    Task.stop = function () {
        _TaskLocal.printLine("Task stopped by user");
        clearInterval(interval);
        worker.terminate();
        _TaskLocal.onWorker = false;
    }
    worker.addEventListener('error', function(e){
        _TaskLocal.printLine("Error in script: " + e);
    }, false);
    worker.postMessage(object);
};

_TaskLocal.printLine = function (text) {
    var el = document.createElement("div");
    el.innerHTML = text;
    var t = document.getElementById("Task_Output");
    t.insertBefore(el, t.childNodes[0]);
}

Task.tick = function () {
    if (_TaskLocal.messages.length != 0) {
        _TaskLocal.printLine(_TaskLocal.messages.shift());
    }
}

Task.update = function (value) {
    document.getElementById("Task_Progress_Bar").value = value;
    document.getElementById("Task_Progress_Value").innerHTML = value + "%";
};