/// <reference path="All References.js" />
var Modes = new Object();

var _Modeslocal = new Object();
_Modeslocal.modesLoadFunc = new Array();
_Modeslocal.modesHTML = new Array();
_Modeslocal.modesUpdateFunc = new Array();

Modes.add = function (htmlLoc, name, onloadfunc, updatefunc, id) {
    loadingfunc.push(function () {
        var X = new XMLHttpRequest();
        X.open("GET", htmlLoc, true);
        X.send();
        X.onreadystatechange = function () {
            if (X.readyState == 4) {
                if (X.status == 200) {
                    var id = _Modeslocal.modesHTML.length;
                    _Modeslocal.modesHTML[id] = X.responseText;
                    var el = document.createElement("div");
                    el.className = "ModeItem";
                    el.onclick = function () { Modes.changemode(this.o) }.bind({ o: id });
                    el.innerHTML = name;
                    document.getElementById("ModeCont").appendChild(el);
                    _Modeslocal.modesLoadFunc[id] = onloadfunc;
                    _Modeslocal.modesUpdateFunc[id] = updatefunc;
                    if (name == "Enter Code Mode") {
                        Modes.changemode(id);
                    }
                    return id;
                }
                console.error("The webpage " + htmlLoc + " cannot be found, the error code is " + X.status);
                return -1;
            }
        };
    })
};

var defmode = "stats";
var currmode = defmode;
	/*_Modeslocal.Modes = new Object();
	function addupdatemode(loc, name) {
	    if (name == undefined) {
	        name = loc.slice(0, loc.length - 2);
	    }
	    _Modeslocal.Modes.name = name;
	    _Modeslocal.Modes.loc = loc;
	}*/
	
	
	/*_Modeslocal.modesHTML = {
	    def: "<div style=\"text-align:center;padding-top:20px\"> <div id=\"codetoandfrom\"> <span class=\"tofromblock\"> <div class=\"title\">Code</div> <div id=\"nospacedcode\" contenteditable class=\"inputbox\"></div> </span> <span class=\"separation\">&nbsp</span> <span class=\"tofromblock\"> <div class=\"title\">Action</div> <br /> <br /> <br /> <div id=\"transholder\"> <div id=\"trans1\" class=\"translationtype\"> Move Letter<input type=\"text\" /> to <input type=\"text\" /><img onclick=\"DelTrans(1)\" class=\"crossimg\" src=\"cross-24-20.png\" /> </div> </div> <div id=\"newcont\" class=\"NewPoint\"> <span onclick=\"NewTrans()\" style=\"width:70%\">New</span> <div onclick=\"newarrowclick()\" style=\"float:right;height:100% width:30%\"> <img src=\"Arrowdown.png\" style=\"width:10px\" /> </div> </div> <div style=\"display:none\" id=\"Suggestions\"> </div> <br /> <div>Square: <table contenteditable=\"true\" id=\"keysquare\" onclick=\"squareclick()\" align=\"center\" class=\"keysquare\"> <tr> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> </table> </div> </span> <span class=\"separation\">&nbsp</span> <span class=\"tofromblock\"> <div class=\"title\">Translation</div> <div id=\"output\" onmouseup=\"selectupdate()\" class=\"outputbox\"></div> </span> <span class=\"separation\">&nbsp</span> <span class=\"separation\">&nbsp</span> </div> <div id=\"output\" style=\"font-family:monospace;font-size:20px\"></div> <br style=\"width:1000px\" /> </div> <div style=\"width:60%;float:left\" id=\"displaypanal\"><div id=\"FreqChart\" class=\"BarChart DisChart\"></div> </div> <div class=\"buttonspanal\"> <div> <div class=\"title\">Word Look Up</div> <br /> <div>Word: <input style=\"width:80px\" type=\"text\" id=\"textsearch\" /> Original: <input style=\"width:80px\" id=\"origsearch\" type=\"text\" /> Type: <select id=\"searchtype\"> <option>All</option> <option>Nown</option> <option>Verb</option> <option>Adjective</option> <option>Adverb</option> </select></div><input type=\"button\" value=\"Search\" onclick=\"updatesearch()\" /> <br /> Values: <div class=\"outputbox\" style=\"height:40px;width:98%;margin-top:20px\" id=\"searchoutput\"></div> <div/> <br/> <div> <div class=\"title\">Test Probibilities</div> <br/> Probibility of <input id=\"ProbTestInput\" type=\"text\" style=\"width:20px\"> <input type=\"button\" value=\"Test\" onclick=\"ProbTest()\"> <div/> <br/> <div> <div class=\"title\">Vigenère Translation:</div> <br/> Key: <input id=\"ProbTestKey\" type=\"text\" style=\"width:20px\"> Cipher: <input id=\"ProbTestCipher\" type=\"text\" style=\"width:20px\"> Plain: <input id=\"ProbTestPlain\" type=\"text\" style=\"width:20px\"> <br/> <input type=\"button\" value=\"Test\" onclick=\"VTransUpdate()\"> <div/> <br/>",
	    entercode: "<div style=\"text-align: center\"> <span style=\"width: 70%\" class=\"tofromblock\"> <div class=\"title\">Enter Code:</div> <div id=\"nospacedcode\" style=\"width: 1000px\" contenteditable=\"\" class=\"inputbox\"></div> </span> <br /> <br /> <br /> <span onclick=\"ECM_Remove_Spaces();\" class=\"button\" style=\"width: 70px; padding: 20px\">Remove Spaces</span> <span onclick=\"ECM_Upper_Case()\" class=\"button\" style=\"width: 70px; padding: 20px\">Convert to Upper Case</span> <span onclick=\"ECM_No_Format()\" class=\"button\" style=\"width: 70px; padding: 20px\">Remove Formatting</span> <span onclick=\"ECM_No_Extra()\" class=\"button\" style=\"width: 70px; padding: 20px\">Remove All Non Letters</span> <span onclick=\"ECM_No_X()\" class=\"button\" style=\"width: 70px; padding: 20px\">Remove <input id=\"ECM_Remove\" onclick=\"noevent()\" type=\"text\" style=\"width: 20px\" /></span> <span onclick=\"ECM_Only_X()\" class=\"button\" style=\"width: 70px; padding: 20px\">Keep all but <input id=\"ECM_Keep\" onclick=\"noevent()\" type=\"text\" style=\"width: 20px\" /></span> <br /> <br /> <br /> <br /> <span onclick=\"ECM_All()\" class=\"button\" style=\"width: 70px; padding: 20px\">Do All</span> </div>",
	    crib: '<br /><br /><div onkeydown="CRIB_lastinput = event.srcElement.innerHTML" oninput="return CribEnterText(event)" id="CribTextHolder" contextmenu="th"</div><div id="CRIB_distr" class="botpan"></div><br /><br /><br />',
	    stats: '<div id="graph"></div>'
	};*/
Modes.changemode = function(id) {
	    document.getElementById("moded").innerHTML = _Modeslocal.modesHTML[id];
	    currmode = id;
	    _Modeslocal.modesLoadFunc[id]();
	    _UpdateLocal.updateFunc = _Modeslocal.modesUpdateFunc[id];
	    /*if (what == "crib") {
	        document.getElementById("moded").innerHTML = "";
	        document.getElementById("moded").innerHTML = _Modeslocal.modesHTML.crib;
	        currmode = "crib";
	        if (code.length > 0) {
	            var num = Math.floor(code.length / 68) +1;
	            var rem = code.length % 68;
	            for (var i = 0; i < num - 1; i++) {
	                var el = document.createElement("div");
	                el.innerHTML = '<div class="CribName">' + code.slice(68 *i, 68 * (i+1)) + '</div> <table cellspacing="0"> <tr class="CribTable">' + RepeatSt("<td></td>", 68) + '</table><br />';
	                document.getElementById("CribTextHolder").appendChild(el);
	            }
	            if (rem == 0) {
	                var el = document.createElement("div");
	                el.innerHTML = '<div class="CribName">' + code.slice(code.length - rem, code.length) + '</div> <table cellspacing="0"> <tr class="CribTable">' + RepeatSt("<td></td>", 68) + '</table>';
	                document.getElementById("CribTextHolder").appendChild(el);
	            }
	            else {
	                var el = document.createElement("div");
	                el.innerHTML = '<div class="CribName">'+ code.slice(code.length -rem, code.length) + '</div> <table cellspacing="0"> <tr class="CribTable">' + RepeatSt("<td></td>", rem) + '</table>';
	                document.getElementById("CribTextHolder").appendChild(el);
	            }
	        }
	    }
	    else if (what == "entercode") {
	        document.getElementById("moded").innerHTML = "";
	        document.getElementById("moded").innerHTML = _Modeslocal.modesHTML.entercode;
	        document.getElementById("nospacedcode").innerText = code;
	        currmode = "entercode";
	    }
	    else if (what == "stats") {
	        document.getElementById("moded").innerHTML = "";
	        document.getElementById("moded").innerHTML = _Modeslocal.modesHTML.stats;
	        currmode = "stats";
	    }
	    else {
	        document.getElementById("moded").innerHTML = "";
	        document.getElementById("moded").innerHTML = _Modeslocal.modesHTML.def;
	        document.getElementById("nospacedcode").innerText = code;
	        currmode = "def";
	        load();
	    }*/
	}

