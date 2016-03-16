/// <reference path="../Data.js" />
/// <reference path="../CodeSolvers.js" />

var WORKER = false;
if (WORKER) {
    self.addEventListener('message', function (e) {
        var ret = solveUnknown.apply(this, e.data.values);
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


function solveUnknown(what) {
    
}