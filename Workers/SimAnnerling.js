/// <reference path="../Data.js" />
/// <reference path="../CodeSolvers.js" />

var WORKER = false;
if (WORKER) {
    self.addEventListener('message', function (e) {
        var ret = spaceText.apply(this, e.data.values);
        postMessage({ type: "return", text: ret.value });
    });

    function output(what) {
        postMessage({ type: "output", text: what });
    }

    function updateProgress(fraction) {
        postMessage({ type: "update", text: fraction });
    }

    importScripts("../Data.js");
    importScripts("../CodeSolvers.js");
}
else {
    function output(what) {
        console.log(what);
    }
    function updateProgress(f) { }
}

function isAccept(difference, temp) {
    if (difference <= 0) {
        return true;
    }
    var rnd = Math.random();
    var prob = Math.pow(1 / Math.E, difference / temp);
    return prob > rnd;
}

function changeKey(key) {
    var alkey = key.split("");//Making a hard copy and arraying it
    var pos1 = Math.floor(Math.random() * key.length);
    var char1 = alkey.splice(pos1, 1);
    var pos2 = Math.floor(Math.random() * key.length-1);
    var char2 = alkey.splice(pos2, 1, char1);
    alkey.splice(pos1, 0, char2);
    return alkey.join("");
}

function SimAnnerling(func, lengthOfKey, keyCharSet) {
    //Calling the function
    var TIMES = 5000;
    var currKey = keyCharSet.slice(0, lengthOfKey);
    var alternative = "";
    for(var temp = 100;temp>0;temp--){
        for (var i = 0; i < TIMES; i++) {
            alternative = changeKey(currKey);
            if (isAccept(quadramRate(func(currKey)) - quadramRate(func(alternative)), temp)) {
                currKey = alternative;
            }
        }
    }
    return currKey;
}