/// <reference path="../../All References.js" />

Modes.add("Modes/HTML/Enter Code.html", "Enter Code Mode", function () {
    document.getElementById("nospacedcode").innerText = code;
    document.getElementById("nospacedcode").focus();
}, function(){
	code = document.getElementById("nospacedcode").innerText;
});

function ECM_Add_Unadded() {
    var o = addWordsToallwords(document.getElementById("nospacedcode").innerHTML);
    displaypopup(JSON.stringify(o));
}

function ECM_Remove_Spaces() {
    ECM_No_Format();
    document.getElementById('nospacedcode').innerText = remove(' ', code);
}

function ECM_Upper_Case() {
    ECM_No_Format();
    document.getElementById('nospacedcode').innerText = code.toUpperCase();
}

function ECM_No_Format() {
    document.getElementById('nospacedcode').innerText = document.getElementById("nospacedcode").innerText;
    update();
}

function ECM_No_Extra() {
    ECM_No_Format();
    var newtext = "";
    for (var i = 0; i < code.length; i++) {
        var charc = code.charCodeAt(i);
        if ((charc >= 97 && charc <= 122)/*Lower*/ || (charc >= 65 && charc <= 90)/*Upper*/) {
            newtext += code[i];
        }
    }
    document.getElementById('nospacedcode').innerText = newtext;
}

function ECM_No_X() {
    if (document.getElementById("ECM_Remove").value == "") {
        createwarning("No Value is in the remove box");
        return false;
    }
    ECM_No_Format();
    document.getElementById('nospacedcode').innerText = remove(document.getElementById("ECM_Remove").value, code);
}

function ECM_Only_X(e) {
    if (document.getElementById("ECM_Keep").value == "") {
        createwarning("No Value is in the keep box");
        return false;
    }
    ECM_No_Format();
    document.getElementById('nospacedcode').value = code.toUpperCase();
    //do stuff
}

function ECM_All() {
    ECM_Remove_Spaces();
    update();
    ECM_Upper_Case();
    update();
    ECM_No_Extra();
    update();
}