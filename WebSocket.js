/// <reference path="All References.js" />
var websocketchannel;
var userloggedin = false;
var login;

function WScorrperson(what) {
    var corpers = false;
    for (var i = 0; i < what.length; i++) {
        if (what[i] == login) {
            corpers = true;
        }
    }
    return corpers;
}

var pusherLogFunction = function () { };
function bindPusherLogFunction(func) {
    pusherLogFunction = func;
}

function bindConsoleLogFunction() {
    bindPusherLogFunction(function (message) { console.log(message) });
}

function initWebSocket(loggin, password) {
    Pusher.log = function (message) {
        pusherLogFunction(message);
    };

    var pusher = new Pusher(privateKey, {
        encrypted: true,
        authEndpoint: webSiteLocation,
        auth: {
            params: {
                Name: loggin,
                Pass: password
            }
        }
    });
    Pusher.channel_auth_endpoint = webSiteLocation;
    websocketchannel = pusher.subscribe('private-channel');
    websocketchannel.bind('pusher:subscription_succeeded', function () {
        login = loggin;
        successlogin();
        console.log("Succesful login as " + login + "!");
    });
    websocketchannel.bind('pusher:subscription_error', function () {
        failedlogin();
        console.error("Failed login");
    });
    websocketchannel.bind('client-eval', function (data) {
        if (WScorrperson(data.per)) {
            console.log("Evaluating message from " + data.from + " :" + data.mes);
            eval(data.mes);
        }
    });
    websocketchannel.bind('client-postValue', function (data) {
        if (WScorrperson(data.per)) {
            pusherSetValue(data.mes);
            if (data.mes.data.length > 100)
                data.mes.data = data.mes.data.slice(0, 100) + "...";
            console.info("Setting variable from " + data.from + ": " + data.mes.name + " -> " + data.mes.data)
        }
    });
}

function pusherSetValue(data) {
    if (data == undefined || data.name == undefined || data.data == undefined)
        console.error("Wrong perameters were sent in set value!");
    var objectToAssign;
    switch (data.type) {
        case "object":
            objectToAssign = JSON.parse(data.data);
            break;
        case "string":
            objectToAssign = data.data;
            break;
        case "number":
            objectToAssign = Number(data.data);
            break;
        case "boolean":
            objectToAssign = Boolean(data.data);
            break;
        case "function":
            //Evil eval should be justified here
            eval("objectToAssign = " + data.data);
            break;
    }
    window[data.name] = objectToAssign;
}

function convertToLambdaFunc(what) {
    return "function" + /\([\s\S]*\)[\s\S]*/.exec(what.toString())
}

function sendValue(value, name, to) {
    var postingValue = "";
    switch(typeof(value)){
        case "object":
            postingValue = JSON.stringify(value);
            break;
        case "string":
        case "number":
        case "boolean":
            postingValue = value.toString();
            break;
        case "function":
            if(value.toString()[9] == "(")
                postingValue = value.toString();
            else {
                postingValue = convertToLambdaFunc(value);
            }
            break;
        default:
            console.error("Perameter type not supported!");
            break;
    }
    if (value == undefined || typeof (name) !== "string")
        console.error("Wrong perameters entered!");
    WSsend("postValue", {
        data: postingValue,
        type: typeof(value),
        name: name
    }, to);
}

function displaylogin() {
    displaypopup('<form method="post" action="javascript:initWebSocket(document.getElementById(\'Username\').value, document.getElementById(\'Password\').value)"><h1>Login</h1><div id="failedlogin"></div><br/>Username: <input id="Username" type="text"/><br/>Password: <input id="Password" type="text" /><br/><input type="submit"/></form>');
}

function failedlogin() {
    document.getElementById("failedlogin").innerHTML = "Login Failed!";
}

function successlogin() {
    userloggedin = true;
    hidepopup();
}

function evalOther(what, to) {
    var valueToSend = "";
    if (typeof (what) == "function") {
        valueToSend = "var __rndFunc123 = " + convertToLambdaFunc(what) + ";__rndFunc123();";
    }
    else
        valueToSend = what;
    WSsend("eval", valueToSend, to);
}

var _websocketLocal = {
    lastName: "all"
}
function WSsend(command, what, to) {
    if (to === undefined) {
        to = _websocketLocal.lastName
    }
    if (to == "all") {
        to = ["Thomas", "Ryan", "Ellie"];
    }
    if (what === undefined || command === undefined)
        console.error("Need to define perameters!");
    _websocketLocal.lastName = to;
    websocketchannel.trigger("client-" + command, {
        per: to,
        from: login,
        mes: what
    });
}