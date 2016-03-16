/// <reference path="../../All References.js" />
Modes.add("Modes/HTML/Default.html", "Default", function () {
    document.getElementById("nospacedcode").innerText = code;
    document.getElementById("output").onscroll = function () {
        document.getElementById("nospacedcode").scrollTop = document.getElementById("output").scrollTop;
    }

    document.getElementById("nospacedcode").onscroll = function () {
        document.getElementById("output").scrollTop = document.getElementById("nospacedcode").scrollTop;
    }
    loadTranslationElements();
    createletterdis();
}, function(){
    updatecodevalue(document.getElementById("nospacedcode").innerText);
    var alltransel = document.getElementById("transholder").querySelectorAll(".translationtype");
    var old = -1;
    var offset = 0;
    for (var i = 0; i < transarray.length; i++) {
        if (transarray[i] == "_") {
            offset++;
            continue;
        }
        for (var o = 0; o < TranslationElements.length; o++) {
            if (transarray[i] == TranslationElements[o].id) {
                var arrayinput = [];
                for (var p = 0; p < TranslationElements[o].inputfields; p++) {
                    try {
                        arrayinput[arrayinput.length] = alltransel[i - offset].getElementsByTagName("input")[p].value;
                    }
                    catch (e) {
                        //debugger
                    }
                }
                old = TranslationElements[o].processfunc(old, arrayinput);
            }
        }
    }
    document.getElementById("output").innerHTML = spanstuff(old);
    plainText = old;
    /*
    if (old.length > 1) {
        document.getElementById("output").style.height = "1%";
    }
    */
    createletterdis();
    //Update square
    if (document.getElementById("keysquare") != undefined && !debugon) {
        var keysq = "";
        var htmlkey = document.getElementById("keysquare").getElementsByTagName("td");
        for (var i = 0; i < htmlkey.length; i++) {
            if (htmlkey[i].innerText == "") {
                keysq += "_";
            }
            else {
                keysq += htmlkey[i].innerText;
            }
        }
        document.getElementById("transholder").getElementsByTagName("input")[0].value = keysq;
    }
});