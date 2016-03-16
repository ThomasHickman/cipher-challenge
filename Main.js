/// <reference path="All References.js" />
var prevvar = []; for (rndvar in window) { prevvar[prevvar.length] = rndvar };
var initwinarr = new Array();

var clear = true;
var allwordssorted = [];
function preload() {
    setTimeout(load, 50);
}

function conv(a) {
    return a;
}

function getglobals() {
    var t = prevvar;
    var u = [];
    for (i in window) {
        u[u.length] = i
    }
    var f = [];
    for (var l = 0; l < u.length; l++) {
        var thing = false;
        for (var z = 0; z < t.length; z++) {
            if (u[l] == t[z]) {
                thing = true;
                break;
            }
        }
        if (!thing) {
            /*switch (typeof(u[l])) { 
                f[f.length] = {type:"f", text: window[u[l]]};
    }*/
            switch (typeof (u[l])) {
                case "function":
                case "number":
                case "string":

            }
            f[f.length] = JSON.stringify(window[u[l]]);
        }
        thing = false;
    }
    return f;
}

var loadingfunc = [];

function load() {
    //Modes.changemode(Modes.defaultId);
    document.body.onclick = function () {
        setTimeout(update, 50);
    }
    document.body.onkeydown = function () {
        setTimeout(update, 50);
    }
    for (var i = 0; i < loadingfunc.length; i++) {
        loadingfunc[i]();
    }
}


function squareclick() {
    /*var yes = false;
    try {
        if (getSelection().anchorNode.getAttribute("on") == "1") {
            yes = true;
        }
    } catch (e) { };
    if (yes) {
        window.getSelection().anchorNode.style.cssText = "background-color: White";
        getSelection().anchorNode.setAttribute("On", 0);
    }
    else {
        window.getSelection().anchorNode.style.cssText = "background-color: Blue";
        getSelection().anchorNode.setAttribute("On", 1);
    }*/

}

function addtocode(amount, what) {
    var finalst = "";
    for (var i = 0; i < code.length; i++) {
        finalst += allupperletters[(allupperletters.indexOf(code[i]) + (i * amount)) % 26];
    }
    return finalst;
}


function allenigmasub(letter) {
    var finalst = [];
    for (var i = 0; i < allupperletters.length; i++) {
        for (var o = 0; o < allupperletters.length; o++) {
            if (finalst[i] === undefined) {
                finalst[i] = "";
            }
            if (o == i) {
                finalst[i] += letter;
            } else {
                finalst[i] += "_";
            }
        }
    }
    return finalst;
}

/*function solveenigma(arrayst, what) {
    var finalst = "";
    for (var i = 0; i < what.length; i++) {
        if (arrayst.indexOf(what[i]) == -1) {
            finalst += "_";
        } else {
            finalst += allupperletters[(arrayst.indexOf(what[i]) + i) % 26];
        }
    }
    return finalst;
}*/

function savebutton() {
    if (currmode == "def") {
        localStorage.setItem("trans", savez());
        localStorage.setItem("text", document.getElementById("nospacedcode").innerHTML);
    }
}

function loadbutton() {
    loadz(localStorage.getItem("trans"));
    document.getElementById("nospacedcode").innerHTML = localStorage.getItem("text");
}

function savez() {
    var text = new String();
    var allthing = document.getElementById("transholder").querySelectorAll(".translationtype");
    for (var i = 0; i < allthing.length; i++) {
        text += allthing[i].getElementsByTagName("input")[0].value;
        text += allthing[i].getElementsByTagName("input")[1].value;
    }
    return text;
}

function loadz(string) {
    DelTrans(1);
    var allthing = document.getElementById("transholder").querySelectorAll(".translationtype");
    for (var i = 0; i < string.length; i += 2) {
        NewTrans();
        document.getElementById("transholder").querySelectorAll(".translationtype")[(i / 2)].getElementsByTagName("input")[0].value = string[i];
        document.getElementById("transholder").querySelectorAll(".translationtype")[(i / 2)].getElementsByTagName("input")[1].value = string[i + 1];
    }
}

function findwordsin(word, origin, wantedpartofspeech) {
    var finalarray = new Array();
    for (var i = 0; i < word.length; i++) {
        var or = undefined
        if (origin != undefined) {
            or = origin.slice(0, i + 1).toLowerCase();
        }
        finalarray = finalarray.concat(findword(word.slice(0, i + 1).toLowerCase(), or, wantedpartofspeech));
    }
    return finalarray;
}

function repeatformat(origin) {
    var format = new Object();
    var idnumberon = 0;
    var letterisrepeat = false;
    var chardone = new Array();
    for (var i = 0; i < origin.length; i++) {
        if (chardone.indexOf(i) != -1) {
            continue;
        }
        for (var o = 0; o < origin.length - i; o++) {
            if (format[i] !== undefined && format[i].indexOf(o + 1 + i) != -1) {
                continue;
            }
            if (origin[i] == origin.slice(i + 1)[o]) {
                if (format[i] === undefined) {
                    format[i] = new Array();
                }
                format[i][format[i].length] = (o + i + 1);
                chardone[chardone.length] = (o + i + 1);
            }
        }
    }
    return format;
}

function findword(word, origin, wantedpartofspeech) {
    word = word.toLowerCase();
    var foundwords = new Array();
    var ivalues = new Array();
    //Prepare the format for deleting items that don't follow the patten
    if (origin !== undefined) {
        origin = origin.toLowerCase();
        var format = repeatformat(origin);
    }
    for (var i = 0; i < allwords.length; i++) {
        var no = true;
        if (allwords[i].length != word.length) {
            continue;
        }
        for (var n = 0; n < allwords[i].length; n++) {
            if (allwords[i][n] != word[n] && word[n] != "_") {
                no = false;
            }
                //Delete all items that don't follow the patten
            else if (origin !== undefined) {
                if (format[n] !== undefined) {
                    for (var f = 0; f < format[n].length; f++) {
                        if (allwords[i][n] != allwords[i][format[n][f]]) {
                            no = false;
                        }
                    }
                }
            }
        }
        if (no) {
            ivalues[ivalues.length] = i;
            //Delete all items not in the list
            if (wantedpartofspeech !== undefined) {
                if (searchstring(wantedpartofspeech.join(""), partsofspeechdata[i]) == -1) {
                    continue;
                }
            }
            foundwords[foundwords.length] = allwords[i];
        }
    }
    //Find repeat values
    var sorted_arr = foundwords.sort();
    for (var i = 0; i < foundwords.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
            sorted_arr.splice(i, 1);
        }
    }
    return sorted_arr;
}

function unload() {
    savebutton();
}


var keywords = new Array();

function addkeyword(keyword, func, otheroptions) {
    var len = keywords.length;
    keywords[len] = new Object();
    keywords[len].keyword = new String();
    keywords[len].func = new Function();
    keywords[len].otherop = new Object();
    keywords[len].otherop.com = "h";
    keywords[len].keyword = keyword;
    keywords[len].func = func;
    keywords[len].otherop = otheroptions;
}

var errmes = new Array();

function AddErrorMessage(errormes) {
    errmes[errmes.length] = errormes + "<br />";
}

var stoptions = new Array();

function addoptions(option) {
    stoptions[stoptions.length] = option + "<br />";
}

function VTransUpdate() {
    if (document.getElementById("ProbTestKey").value == "") {
        document.getElementById("ProbTestKey").value = allupperletters[straightcrack(allupperletters, allupperletters.indexOf(document.getElementById("ProbTestPlain").value)).indexOf(document.getElementById("ProbTestCipher").value)];
    }
    else if (document.getElementById("ProbTestCipher").value == "") {
        document.getElementById("ProbTestCipher").value = straightcrack(allupperletters, allupperletters.indexOf(document.getElementById("ProbTestPlain").value))[allupperletters.indexOf(document.getElementById("ProbTestKey").value)];
    }
    else if (document.getElementById("ProbTestPlain").value == "") {
        document.getElementById("ProbTestPlain").value = allupperletters[straightcrack(allupperletters, allupperletters.indexOf(document.getElementById("ProbTestKey").value)).indexOf(document.getElementById("ProbTestCipher").value)];
    }
}
//var array = []; for (var i = 0; i < newst.length; i++) { if (i % 2 == 0) { array[array.length] = newst.slice(i, i + 2) } }
function countnum(what) {
    var num = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == what) {
            num++
        }
    };
    return num;
}

function eliminateDuplicates(arr) {
    var i,
      len = arr.length,
      out = [],
      obj = {};

    for (i = 0; i < len; i++) {
        obj[arr[i]] = 0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
}

function addtolist(what) {
    var t = what;
    t = t.split("?").join("");
    t = t.split(".").join("");
    t = t.split(",").join("");
    t = t.split("'").join("");
    t = t.split("\n").join("");
    t = t.split("-").join("");
    t = t.split("’").join("");
    t = t.split("(").join("");
    t = t.split(")").join("");
    t = t.split("–").join("");
    var arr = [];
    var stat = t;
    for (var i = 0; i < stat.split(" ").length; i++) {
        if (findword(stat.split(" ")[i]).length == 0) {
            arr[arr.length] = stat.split(" ")[i].toLowerCase();
        }
    }
    arr = eliminateDuplicates(arr);
    return arr;
}



function removespaces(what) {
    var newcode = new Array();
    for (var i = 0; i < what.length; i++) {
        if (searchstring(allupperletters, what[i]) != -1) {
            //Use first letter as it is certain that this is not involved in a recognition
            newcode[newcode.length] = what[i];
        }
    }
    //Assign the last options.length of letters to the newcode
    newcode = newcode.join("");
    return newcode;
}

function updatesearch() {
    var texttype = document.getElementById("searchtype").value;
    var type = "";
    switch (texttype) {
        case "All":
            var type = undefined;
            break;
        case "Nown":
            var type = "n";
            break;
        case "Verb":
            var type = "v";
            break;
        case "Adjective":
            var type = "j";
            break;
        case "Adverb":
            var type = "r";
            break;
    }
    var orig = document.getElementById("origsearch").value;
    if (orig == "")
        orig = undefined;
    document.getElementById("searchoutput").innerHTML = findwordsin(document.getElementById("textsearch").value, orig, type === undefined ? undefined : [type]);
}


function DecryptRails(what, key) {
    var railon = 0;
    var finalst = [];
    var addon = 0;
    var rowon = 0;
    var numberon = 0;
    var CumuI = 0;
    while (true) {
        for (var i = 0; i < key; i++) {
            numberon++;
            if (i == 0) {
                finalst[i + (rowon * (key * 2 - 2))] = what[addon + rowon];
                addon += Math.floor(what.length / (key * 2 - 2) - 0.09) + 1
            }
            else if (i == key - 1) {
                finalst[i + (rowon * (key * 2 - 2))] = what[addon + rowon];
                addon += Math.floor((what.length - key + 1) / (key * 2 - 2) - 0.09) + 1
            }
            else {
                finalst[i + (rowon * (key * 2 - 2))] = what[addon + rowon * 2];
                numberon++;
                finalst[((key * 2 - 2) - i) + (rowon * (key * 2 - 2))] = what[addon + rowon * 2 + 1];
                addon += (Math.floor((what.length - i) / (key * 2 - 2) - 0.09) + 1) + (Math.floor((what.length - ((key * 2 - 2) - i)) / (key * 2 - 2) - 0.09) + 1);
            }
            if (numberon >= what.length) {
                return finalst.slice(0, what.length + 1).join("");
            }
        }
        CumuI += i;
        rowon++;
        addon = 0;
    }
}


function createbigrams(what) {
    var array = [];
    for (var i = 0; i < what.length - 1; i++) {
        array[i] = what.slice(i, i + 1);
    }
}

function getbifidcode(key) {
    var bifidletters = "abcdefghiklmnopqrstuvwxyz";
    for (var i = 0; i < key.length; i++) {
        bifidletters = remove(key[i], bifidletters);
    }
    return key + bifidletters;
}

function allwordsbifid(number) {
    var topnumber = Infinity; var topname = ""; for (var i = 0; i < allwords.length; i++) {
        if (chisquared(solvebifid(code, getbifidcode(remove("j", eliminateDuplicates(allwords[i].toLowerCase()).join(""))), number)) < topnumber) {
            topnumber = chisquared(solvebifid(code, getbifidcode(remove("j", eliminateDuplicates(allwords[i].toLowerCase()).join(""))), number))
            topname = allwords[i];
            console.log("New Top :" + topname + " number " + topnumber);
        }
    }
}

function dobifid(num) {
    var array = [];
    for (var i = 0; i < code.length; i++) {
        if (i % num == 0) {
            array[array.length] = code.slice(i, i + num)
        }
    }
    console.log(array);
    var array1 = [];
    for (var i = 0; i < array.length; i++) {
        if (i % 2 == 0) {
            array1[array1.length] = array[i]
        }
    }
    var array2 = [];
    for (var i = 0; i < array.length; i++) {
        if ((i + 1) % 2 == 0) {
            array2[array2.length] = array[i]
        }
    }
    var finalst = "";
    try {
        for (var i = 0; i < code.length; i++) {
            for (var o = 0; o < num; o++) {
                finalst += array1[i][o] + array2[i][o];
            }
        }
    } catch (e) { }
    return finalst;
}


function arraypairs() {
    var array = []; for (var i = 0; i < code.length; i++) { if (i % 2) { array[array.length] = code.slice(i - 1, i + 1) } }
    return array;
}

function spacecode(space) {
    var newcode = ""; for (var i = 0; i < code.length; i++) { newcode += code[i]; if (i % space) { newcode += " " } }
}

function addWordsToallwords(string) {
    var spaced = string.split(" ");
    for (var i = 0; i < spaced.length; i++) {
        if (allwords.indexOf(spaced[i]) == -1) {
            allwords[allwords.length] = spaced[i];
        }
    }
    return allwords;
}

var output = "";
var code = "";
var first = true;
var save = false;

function begin(input) {
    errmes = "";
    if (first) {
        code = input;
        first = false;
    } else {
        for (var i = 0; true; i++) {
            if (i >= keywords.length) {
                AddErrorMessage("Cannot find keyword");
                break;
            }
            if (input.slice(0, keywords[i].keyword.length + keywords[i].otherop.nospace == true ? 0 : 1 /*For Space*/) == keywords[i].keyword + keywords[i].otherop.nospace == true ? " " : "") {
                keywords[i].func(input.slice(keywords[i].keyword.length + keywords[i].otherop.nospace == true ? 0 : 1));
                break;
            }

        }
    }
    document.getElementById("options").innerHTML = "Options:<br />" + stoptions.join("");
    return errmes + "Code :" + code;
}


//JS Analasis

function jsanalase(jstring) {
    var statments = new Array();
    var ston = false;
    var beginspace = true;
    var spaceon = false;
    var beingspacepos = 0;
    for (var i = 0; i < jstring.length; i++) {
        if ((jstring[i] == '"' || jstring[i] == "'" || jstring[i] == "\t") && !ston) {
            ston = true;
        } else if ((jstring[i] == '"' || jstring[i] == "'" || jstring[i] == "\t") && jstring[i - 1] != "\\") {
            ston = false;
        }
        if (ston) {
            //Format String
        } else if (jstring[i] == " " && beginspace == true && spaceon == false) {
            beingspace = false;
            spaceon = true;
            beingspacepos = i + 1;
        } else if (jstring[i] == " ") {
            var keyword = jstring.slice(beingspacepos, i);
            switch (keyword) {
                case "switch":
                    break;
                case "catch":
                    break;
                case "default":
                    break;
                case "do":
                    break;
                case "for":
                    break;
                case "function":
                    break;
                case "try":
                    break;
                case "while":
                    break;
                case "with":
                    break;

            }
            spaceon = false;
        }
    }
}

var twoletterwords = new String();

function checkwarnings() {
}

var altDocinnerHTML = {};

var altDocument = function(text){
    var f = h.call(document, text);
    f.__defineGetter__("innerHTML", function () {
    });
    f.__defineSetter__("innerHTML", function(){alert()});
    return f
}

var plainText = "";

var _UpdateLocal = new Object();
_UpdateLocal.updateFunc = new function(){};
function update() {
	_UpdateLocal.updateFunc();
    /*if (currmode == "def") {
    }
    else if (currmode == "entercode") {
        code = document.getElementById("nospacedcode").innerText;
    }
    else if (currmode == "crib") {
        composecribper();
    }*/
}

var debugon = true;
function updatespacecodevalue(tunremovedcode) {
    unremovedcode = tunremovedcode;
}

function RepeatSt(what, times) {
    times = Math.floor(times);
    if (times <= 0) {
        return false;
        throw Error("Called with a negetive value");
    }
    var finalst = "";
    for (var i = 0; i < times; i++) {
        finalst += what;
    }
    return finalst;
}

function updatecodevalue(tcode) {
    code = tcode;
}
var unremovedcode = "";


function roundcrack(number) {
    for (var i = 0; i <= number; i++) {
        console.log(straightcrack(code, i));
        debugger;
    }
}

var allupperletters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var alllowerletters = "abcdefghijklmnopqrstuvwxyz";

function searchstring(string, chartosearch) {
    for (var i = 0; i < string.length; i++) {
        if (string[i] == chartosearch) {
            return i;
        }
    }
    return -1;
}

function addnonsence(orig, repwith, setofletters) {
    var newst = orig.split("");
    var reppos = 0;
    for (var i = 0; i < orig.length; i++) {
        if (searchstring(setofletters, orig[i]) != -1) {
            newst[i] = repwith[reppos];
            reppos++;
        }
    }
    return newst.join("");
}

function numberat(num) {
    return code.charCodeAt(num);
}

function tableprintcode(what) {
    table = "<table>";
    for (y in what) {
        table += "<tr><td>" + what[y] + "<td/></tr>"
    }
    table += "</table>";
    document.body.innerHTML = table;
}

function remove(charater, what) {
    var newcode = new Array();
    for (var i = 0; i <= what.length + 2; i++) {
        if (what[i] != charater) {
            //Use first letter as it is certain that this is not involved in a recognition
            newcode[newcode.length] = what[i];
        }
    }
    //Assign the last options.length of letters to the newcode
    newcode = newcode.join("");
    return newcode;
}

//Keywords

addkeyword("code", function (options) {
    stoptions = new Array();
    code = options;
});

addkeyword("save", function (options) {
    if (options == "on") {
        save = true;
    } else {
        save = false;
    }
});

var u_escpae = false;
addkeyword("escape", function (options) {
    if (options == "on") {
        u_escpae = true;
    } else {
        u_escpae = false;
    }
});

addkeyword("remove", function (options) {
    if (options.length < 1) {
        AddErrorMessage("Charater to remove bigger than one letter");
    }
    //Process escape sequences
    //Only doing slash and newline
    if (u_escpae) {
        if (options = "\\n")
            options = "\n";
        if (options = "\\\\")
            options = "\\";
    }
    var newcode = new Array();
    for (var i = 0; i <= code.length - options.length + 1; i++) {
        if (code.slice(i, i + options.length) != options) {
            //Use first letter as it is certain that this is not involved in a recognition
            newcode[newcode.length] = code[i];
        }
    }
    //Assign the last options.length of letters to the newcode
    newcode = newcode.join("");
    newcode += code.slice(code.length - options.length + 1);
    code = newcode;
    addoptions("Removed " + options);
});

addkeyword("length", function (options) {
    AddErrorMessage("Length of code " + code.length)
});