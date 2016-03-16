/// <reference path="All References.js" />
function displaypopup(content, editable) {
    if (typeof (content.getElementsByTagName) == "function") {
        document.getElementById("popup").innerHTML = "";
        document.getElementById("popup").appendChild(content);
    }
    else{
        document.getElementById("popup").innerHTML = content;
    }
    document.getElementById("popup").style.display = "block";
    document.getElementById("cover").style.cssText = "-webkit-filter: blur(1px)";
    document.getElementById("cover").onmousedown = function () {
        hidepopup();
    }
}

function hidepopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("cover").style.cssText = "-webkit-filter: initial";
    document.getElementById("cover").onclick = undefined;
}

function spanstuff(stuff) {
    var finalarray = new Array();
    for (var i = 0; i < stuff.length; i++) {
        finalarray[i] = "<span onmousedown='showpos(" + i + ")' id='l" + i + "' onmouseup='hidepos()'><span>" + stuff[i] + "</span></span>";
    }
    return finalarray.join("");
}
var orgshowposcode = "";

function showpos(i) {
    orgshowposcode = code;
    document.getElementById("nospacedcode").innerHTML = code.slice(0, i) + "<span class='highlight'>" + code[i] + "</span>" + code.slice(i + 1, code.length);
}

function hidepos() {
    document.getElementById("nospacedcode").innerHTML = orgshowposcode;
}

function outputletterdis() {
    cont = '<div class="title">Letter Distribution</div><div class="subtitle">On Spaced Code:</div>';
    var BigestLength = 0;
    for (var i = 0; i < allupperletters.length; i++) {
        if (((countletters(allupperletters[i]) / code.length) * 100) > BigestLength) {
            BigestLength = (countletters(allupperletters[i]) / code.length) * 100;
        }
    }
    var letterlength;
    for (var i = 0; i < allupperletters.length; i++) {
        letterlength = countletters(allupperletters[i], code);
        cont += '<div class="GraphRow"><div class="PosTextHolder"><div class="BarValue">' + Math.round((letterlength / code.length) * 1000) / 10 + "%" + '</div></div><div style="height:' + (10000 * letterlength) / (code.length * BigestLength) + '%' + '" class="bar">&nbsp</div><div class="BarText">' + allupperletters[i] + '</div></div>'
    }
    cont += "</div>";
    return cont;
}

function returntable(arrayofvalues, arrayoflables, unit, precision, title, subtitle) {
    var cont = document.createElement("div");
    cont.classList.add("BarChart");
    cont.classList.add("DisChart");
    cont.innerHTML = '<div class="title"></div>' + title + '<div class="subtitle">' + subtitle + '</div>';
    var BigestLength = 0;
    for (var i = 0; i < arrayofvalues.length; i++) {
        if (arrayofvalues[i] > BigestLength) {
            BigestLength = arrayofvalues[i];
        }
    }
    var letterlength;
    for (var i = 0; i < arrayofvalues.length; i++) {
        cont.innerHTML += '<div class="GraphRow"><div class="PosTextHolder"><div class="BarValue">' + Math.round(arrayofvalues[i] * Math.pow(10, precision)) / Math.pow(10, precision) + unit + '</div></div><div style="height:' + (Math.round(arrayofvalues[i] * Math.pow(10, precision)) / Math.pow(10, precision) / BigestLength) * 100 + '%' + '" class="bar">&nbsp</div><div class="BarText">' + arrayoflables[i] + '</div></div>'
    }
    cont.innerHTML += "</div>";
    return cont;
}

function HTMLJScomp(what) {
}

function createletterdis() {
    var element = document.createElement("div");
    element.classList.add("BarChart");
    element.classList.add("DisChart");
    element.id = "FreqChart";
    document.getElementById("FreqChart").innerHTML = outputletterdis();
}

function selectupdate() {
    document.getElementById("textsearch").value = window.getSelection();
    document.getElementById("origsearch").value = code.slice(getSelection().anchorNode.parentNode.parentElement.id.slice(1), parseInt(getSelection().extentNode.parentNode.parentElement.id.slice(1)) + 1);
}

function warningchange() {
    if (warningcallbackfunc != undefined)
        warningcallbackfunc();
    document.getElementById("warningpannel").innerHTML = "";
    update();
}


var warningcallbackfunc;

function createwarning(text, callbackfunction) {
    if (callbackfunction != undefined) {
        document.getElementById("warningpannel").innerHTML = "<img src='Warning.png' />" + text + " <a href='javascript:warningchange()'>Change?</a>"
    }
    else {
        document.getElementById("warningpannel").innerHTML = "<img src='Warning.png' />" + text + " <a href='javascript:warningchange()'>OK</a>"
    }
    warningcallbackfunc = callbackfunction;
}