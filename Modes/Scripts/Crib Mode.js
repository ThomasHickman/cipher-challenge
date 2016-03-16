/// <reference path="../../All References.js" />
var all = [];

var CRIB_lastinput = "";

var CRIB_Translation = {
    influence: {
        pos: [],
        mapping: []
    }
}
/**
 * mapping: A 2d Array with the values of the mapping [a,b], where a->b
 * pos: The positions of all the mappings in the string
 */

Modes.add("Modes/HTML/Crib.html", "Crib Mode", function () {
    if (code.length > 0) {
        var num = Math.floor(code.length / 68) + 1;
        var rem = code.length % 68;
        for (var i = 0; i < num - 1; i++) {
            var el = document.createElement("div");
            el.innerHTML = '<div class="CribName">' + code.slice(68 * i, 68 * (i + 1)) + '</div> <table cellspacing="0"> <tr class="CribTable">' + RepeatSt("<td></td>", 68) + '</table><br />';
            document.getElementById("CribTextHolder").appendChild(el);
        }
        if (rem == 0) {
            var el = document.createElement("div");
            el.innerHTML = '<div class="CribName">' + code.slice(code.length - rem, code.length) + '</div> <table cellspacing="0"> <tr class="CribTable">' + RepeatSt("<td></td>", 68) + '</table>';
            document.getElementById("CribTextHolder").appendChild(el);
        }
        else {
            var el = document.createElement("div");
            el.innerHTML = '<div class="CribName">' + code.slice(code.length - rem, code.length) + '</div> <table cellspacing="0"> <tr class="CribTable">' + RepeatSt("<td></td>", rem) + '</table>';
            document.getElementById("CribTextHolder").appendChild(el);
        }
    }
}, function(){
    composecribper();
});


/**
 * In crib mode, this is the handler for an input
 * @param e - The DOM of the current element
 */

function CribEnterText(e) {
	/**The current Elements Number or ID*/
    var num = parseInt(e.srcElement.id.slice(4));
    var innerHTML = e.srcElement.innerHTML;
    //If more than one character has been entered, reset the value back to it's original
    if (innerHTML.length > 1) {
        e.srcElement.innerHTML = CRIB_lastinput;
    }
    else {
    	//Find out if the current letter is already mapped and delete it if it is.
    	var isMapped = false;
        for (var i = 0; i < CRIB_Translation.influence.pos.length; i++) {
            if (CRIB_lastinput == CRIB_Translation.influence.mapping[i][1]) {
            	isMapped = true;
                break;
            }
        }
        if (isMapped) {
            //Remove the entry
            CRIB_Translation.influence.pos.splice(i, 1);
            CRIB_Translation.influence.mapping.splice(i, 1);
        }
        ////
        if (innerHTML.length == 1) {
            //Add/Replace the entry as with the new value
            CRIB_Translation.influence.pos.push(num);
            CRIB_Translation.influence.mapping.push([code.slice(num, num + 1), innerHTML])
        }
        //Else, do nothing and leave the value unmapped
    }
    
    //Translate Elements
    if (CRIB_Translation.influence.mapping.length != 0) {
        var finalst = -1;
        for (var i = 0; i < CRIB_Translation.influence.mapping.length; i++) {
            finalst = replaceletters(CRIB_Translation.influence.mapping[i][0], CRIB_Translation.influence.mapping[i][1], finalst);
        }
    }
    else {
        finalst = replaceletters("a", "b", -1);
    }
    //Add extra elements
    for (var i = 0; i < finalst.length; i++) {
        if (finalst[i] != "_") {
            document.getElementById("CribTextHolder").getElementsByTagName("td")[i].innerHTML = finalst[i];
        }
        else {
            document.getElementById("CribTextHolder").getElementsByTagName("td")[i].innerHTML = "";
        }
    }
}

loadingfunc[loadingfunc.length] = function () {
    if (currmode == "crib") {
        var allel = document.getElementById("CribTextHolder").getElementsByTagName("td");
        for (var i = 0; i < allel.length; i++) {
            allel[i].id = "Crib" + i;
        }
    }
}


/**
* Function to compose the lower band of the screen, mapping the most likely letters
*/
function composecribper() {
    document.getElementById("CRIB_distr").innerHTML = "";
    for (var i = 0; i < allupperletters.length; i++) {
        //Find the highest value
        var all = findletterprob(allupperletters[i]);
        var highestletter = 0;
        var highestvalue = 0;
        for (var o = 0; o < allupperletters.length; o++) {
            if (all[o] > highestvalue) {
                highestvalue = all[o];
                highestletter = o;
            }
        }
        document.getElementById("CRIB_distr").innerHTML += '<div class="CribDescriber">' + allupperletters[i] + ':' + allupperletters[highestletter] + ' </div><div class="CribBarHolder"><div class="PosTextHolder"><div class="CribBarText">' + Math.floor(highestvalue) + '%</div></div><div class="CribBar" style="width:' + Math.floor(highestvalue) + '%">&nbsp</div></div>'
    }
}