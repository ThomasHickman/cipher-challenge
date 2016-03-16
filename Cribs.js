/// <reference path="All References.js" />
function foursquarecrib(crib, pos, what, prev1, prev2) {
    crib = crib.toLowerCase();
    what = what.toLowerCase();
    try{
        prev1 = prev1.toLowerCase();
        prev2 = prev2.toLowerCase();
    } catch (e) { }
    var size = 5;
    var bifidletters = "abcdefghiklmnopqrstuvwxyz";
    function getsquareletter(x, y, square) {
        var retvalue = square[(y - 1) + ((x - 1) * size)];
        if (retvalue == "_") {
            //Blank charater
            invaidlettergot = true;
            retvalue = "a";
        }
        return retvalue;
    }
    function getsquarepos(letter, square) {
        var pos = square.indexOf(letter);
        if (pos == -1) {
            invaidlettergot = true;
            pos = 0;
        }
        return [Math.floor((pos / size) + 1), (pos % size) + 1];
    }
    var codetext = what.slice(pos, crib.length + pos);
    var retvalue1;
    var retvalue2;
    if (prev1 == undefined) {
        retvalue1 = "_________________________".split("");
    }
    else {
        retvalue1 = prev1.split("");
    }
    if (prev2 == undefined) {
        retvalue2 = "_________________________".split("");
    }
    else {
        retvalue2 = prev.split("");
    }
    if(crib.length%2 != 0){
        crib = crib.slice(0, crib.length -1);
    }
    for (var i = 0; i < crib.length; i+=2) {
        var posa = getsquarepos(crib[i], bifidletters);
        var posb = getsquarepos(crib[i + 1], bifidletters);
        var x = posa[0];
        var y = posb[1];
        retvalue1[(y - 1) + ((x - 1) * size)] = codetext[i];
        x = posb[0];
        y = posa[1];
        retvalue2[(y - 1) + ((x - 1) * size)] = codetext[i+1];
    }
    return [retvalue1.join(""), retvalue2.join("")];
}

function getcodecrib(what, pos) {
    return foursquare(code, foursquarecrib(what, pos, code)[0].toUpperCase(), foursquarecrib(what, pos, code)[1].toUpperCase())
}

function arrangein(what, inwhat) {
    var finalst = "";
    for (var i = 0; i < what.length; i++) {
        if (i % inwhat == 0) {
            finalst += " ";
        }
        finalst += what[i];
    }
    return finalst;
}

function siman() {
    var bifidletters = "abcdefghiklmnopqrstuvwxyz";
    var currkey = bifidletters;
    //Change key
    Math.random();
}