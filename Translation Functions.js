/// <reference path="All References.js" />
///////////////////////////
// Translation Functions //
///////////////////////////

var numberofTrans = 1;
var transarray = [ "s" ];
// Used Letters
/*
 * A B d C d D d E F d G d H I J K L M N O P d Q R S d T U V d W X Y Z
 */
var TranslationElements = [
		{
			id : "s",
			name : "Substitution, single letter",
			colour : "rgb(46, 179, 204)",
			innerHTMLText : "Move Letter<input type='text'/> to <input type='text'/>",
			inputfields : 2,
			processfunc : function(text, input) {
				return replaceletters(input[0], input[1], text);
			}
		},
        {
            id: "g",
            name: "Substitution with keysquare",
            colour: "rgb(10, 179, 204)",
            innerHTMLText: 'Keysquare: <input style="width:80%" type="text"/>',
            inputfields: 2,
            processfunc: function (text, input) {
                return ciphers.simpleSubstitution.decrypt(code, input[0]);
            },
            numSubs: 0,
            oncreate: function () {
                this.numSubs++;
            },
            ondestroy: function () {
                this.numSubs--;
                console.log("destroy")
                if(this.numSubs == 0)
                    console.log("No subs")
            }
        },
		{
			id : "c",
			name : "Caesar Shift",
			colour : 'rgb(132, 197, 106)',
			innerHTMLText : 'Shift Letters By <input type="text"/>',
			inputfields : 1,
			processfunc : function(text, input) {
				return straightcrack(code, parseInt(input[0]));
			}
		},
		{
			id : "v",
			name : "Vigenère",
			colour : 'rgb(132, 197, 106)',
			innerHTMLText : 'Use Key:<input style="width:50px" type="text"/>',
			inputfields : 1,
			processfunc : function(text, input) {
				return solveletterkey(code, input[0]);
			}
		},
		{
			id : "d",
			name : "Delete every Nth Letter",
			colour : 'rgb(116, 129, 111)',
			innerHTMLText : 'Delete the <input style="width:50px" type="text"/><sup>th<\sup>',
			inputfields : 1,
			processfunc : function(text, input) {
				return deleteallbutevery(parseInt(input[0]), code);
			}
		},
		{
			id : "b",
			name : "Beaufort",
			colour : 'rgb(116, 100, 100)',
			innerHTMLText : 'Make Beaufort into Vigenère',
			inputfields : 0,
			processfunc : function(text, input) {
				return decodebeaufort(code);
			}
		},
		{
			id : "p",
			name : "Playfair",
			colour : 'rgb(120, 150, 120)',
			innerHTMLText : 'Solve Playfair, Keysquare:<br/><input style="width:80%" type="text"/>',
			inputfields : 1,
			processfunc : function(text, input) {
				return solveplayfair(code, input[0].toUpperCase());
			}
		},
		{
			id : "f",
			name : "Four Square",
			colour : 'rgb(120, 150, 120)',
			innerHTMLText : 'Solve Four Square<br/>Keysquare 1:<input keysquareinput style="width:80%" type="text"/><br/>Keysquare 2:<input keysquareinput style="width:80%" type="text"/>',
			inputfields : 1,
			processfunc : function(text, input) {
				return foursquare(code, input[0].toUpperCase(), input[1].toUpperCase());
			}
		} ];
function NewTrans() {
	numberofTrans++;
	var newelement = document.createElement("div");
	newelement.id = "trans" + numberofTrans;
	newelement.className = "translationtype";
	for ( var i = 0; i < TranslationElements.length; i++) {
		if (transtype == TranslationElements[i].id) {
			newelement.style.cssText = "background-color: "+ TranslationElements[i].colour + ";";
			newelement.innerHTML = TranslationElements[i].innerHTMLText + '<img onclick="DelTrans(' + numberofTrans + ' )" class="crossimg" src="cross-24-20.png"/>';
			if (TranslationElements[i].oncreate !== undefined) {
			    TranslationElements[i].oncreate();
			}
			break;
		}
	}
	document.getElementById("transholder").appendChild(newelement);
	transarray[transarray.length] = transtype;
}

function DelTrans(number) {
    TranslationElements.forEach(function (el) {
        if (el.id == transarray[number - 1]) {
            if (el.ondestroy !== undefined) {
                el.ondestroy();
            }
        }
    })
	transarray[number - 1] = "_";
	document.getElementById("trans" + number).parentElement
			.removeChild(document.getElementById("trans" + number));
}

var transtype = "s";// Default type

function maketranssub(what) {
	document.getElementById("newcont").style.borderBottom = "initial";
	document.getElementById("Suggestions").style.display = "none";
	transtype = what;
	NewTrans();
}

function newarrowclick() {
	document.getElementById("newcont").style.borderBottom = "2px solid black";
	document.getElementById("Suggestions").style.display = "inline";
}

function loadTranslationElements() {
	for ( var i = 0; i < TranslationElements.length; i++) {
		document.getElementById("Suggestions").innerHTML += '<div onclick="maketranssub(\''+ TranslationElements[i].id+ '\')" class="Suggestion">'+ TranslationElements[i].name + '</div>';
	}
}

// ///////////////////////

function replaceletters(letterto, letterfrom, old) {
	var newst = new String();
	if (old == "no")
		console.error("Putting 'no' as parameter no longer works");
	if (old == -1)/* Changed from "no" to -1 */{
		for ( var i = 0; i <= code.length - 1; i++) {
			newst += "_";
		}
	} else {
		newst = old;
	}
	var newstarray = newst.split("");
	for ( var i = 0; i <= code.length - 1; i++) {
		if (code[i] == letterto) {
			newstarray[i] = letterfrom;
		}
	}
	return newstarray.join("");
}

function straightcrack(text, key) {
	var codetogether = new String();
	for ( var y = 0; y <= text.length - 1; y++) {
		if ((text.charCodeAt(y) - 65 + key) < 0) {
			codetogether += String.fromCharCode((26 - ((-(text.charCodeAt(y) - 65 + key)) % 26)) + 65);
		} else {
			codetogether += String.fromCharCode(((text.charCodeAt(y) - 65 + key) % 26) + 65);
		}
	}
	return codetogether;
}

function solveletterkey(text, key) {
	var finalst = "";
	for ( var i = 0; i < text.length; i++) {
		finalst += straightcrack(text[i], 26 - allupperletters.indexOf(key[i% key.length]));
	}
	return finalst;
}

function deleteallbutevery(number, what) {
	var newcode = "";
	for ( var i = 0; i < what.length; i++) {
		if (i % number === 0) {
			newcode += what[i];
		}
	}
	return newcode;
}

function decodebeaufort(what) {
	var newcode = "";
	for ( var i = 0; i < what.length; i++) {
		newcode += allupperletters[allupperletters.length - 1
				- allupperletters.indexOf(what[i])]
	}
	return newcode;
}

function solveplayfair(what, square, size) {
	//square = removespaces(square.toUpperCase());
	if (size == undefined)
		size = 5;
	var invaidlettergot = false;
	function getsquareletter(x, y) {
		var retvalue = square[(y - 1) + ((x - 1) * size)];
		if (retvalue == "_") {
			// Blank charater
			invaidlettergot = true;
			retvalue = "a";
		}
		return retvalue;
	}
	function getsquarepos(letter) {
		var pos = square.indexOf(letter);
		if (pos == -1) {
			invaidlettergot = true;
			pos = 0;
		}
		return [ Math.floor((pos / size) + 1), (pos % size) + 1 ];
	}
	if (what.length % 2 != 0) {
		console.log("SolvePlayfair: code passed to function has an odd length");
		createwarning("Error in playfair, look at console", function() {
		});
		return -1;
	}
	var finalst = "";
	for ( var i = 0; i < what.length; i += 2) {
		var a = what[i];
		var b = what[i + 1];
		var sqposa = getsquarepos(a);
		var sqposb = getsquarepos(b);
		/*
		 * if (a == b) { //Same letter //Replace second letter with x finalst +=
		 * a + "X"; i -= 2; what = finalst; } else
		 */if (sqposa[0] == sqposb[0]) {
			// Same row
			// Get letter below
			// 1st
			if (sqposa[1] == 1) {
				// Wrap round
				finalst += getsquareletter(sqposa[0], size);
			} else {
				finalst += getsquareletter(sqposa[0], sqposa[1] - 1);
			}
			// 2nd
			if (sqposb[1] == 1) {
				// Wrap round
				finalst += getsquareletter(sqposb[0], size);
			} else {
				finalst += getsquareletter(sqposb[0], sqposb[1] - 1);
			}
		} else if (sqposa[1] == sqposb[1]) {
			// Same collom
			// Get letter across
			// 1st
			if (sqposa[0] == 1) {
				// Wrap round
				finalst += getsquareletter(size, sqposa[1]);
			} else {
				finalst += getsquareletter(sqposa[0] - 1, sqposa[1]);
			}
			// 2nd
			if (sqposb[0] == 1) {
				// Wrap round
				finalst += getsquareletter(size, sqposb[1]);
			} else {
				finalst += getsquareletter(sqposb[0] - 1, sqposb[1]);
			}
		} else {
			// No trend
			// Do rectangle
			// 1st
			finalst += getsquareletter(sqposa[0], sqposb[1]);
			// 2nd
			finalst += getsquareletter(sqposb[0], sqposa[1]);
		}
		// See if an invalid letter has been used and replace it with _
		if (invaidlettergot) {
			invaidlettergot = false;
			// Take off final 2 letters
			finalst = finalst.slice(0, finalst.length - 2);
			// Replace with blanks
			finalst += "_";
			finalst += "_";
		}
	}
	return finalst;
}

function foursquare(what, key1, key2) {
	var bifidletters = "abcdefghiklmnopqrstuvwxyz";
	var invaidlettergot = false;
	var size = 5
	function getsquareletter(x, y, square) {
		var retvalue = square[(y - 1) + ((x - 1) * size)];
		if (retvalue == "_") {
			// Blank charater
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
		return [ Math.floor((pos / size) + 1), (pos % size) + 1 ];
	}
	if (what.length % 2 != 0) {
		console
				.log("SolveFourSquare: code passed to function has an odd length");
		createwarning("Error in foursquare, look at console", function() {
		});
		return -1;
	}
	var finalst = "";
	for ( var i = 0; i < what.length; i += 2) {
		var a = what[i];
		var b = what[i + 1];
		var sqposa = getsquarepos(a, key1);
		var sqposb = getsquarepos(b, key2);
		finalst += getsquareletter(sqposa[0], sqposb[1], bifidletters);
		finalst += getsquareletter(sqposb[0], sqposa[1], bifidletters);
		// See if an invalid letter has been used and replace it with _
		if (invaidlettergot) {
			invaidlettergot = false;
			// Take off final 2 letters
			finalst = finalst.slice(0, finalst.length - 2);
			// Replace with blanks
			finalst += "_";
			finalst += "_";
		}
	}
	return finalst;
}

function solvetwosquare(what, key1, key2) {
	var size = 5;
	function getsquareletter(x, y, square) {
		var retvalue = square[(y - 1) + ((x - 1) * size)];
		if (retvalue == "_") {
			// Blank charater
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
		return [ Math.floor((pos / size) + 1), (pos % size) + 1 ];
	}
	if (what.length % 2 != 0) {
		console
				.log("SolveFourSquare: code passed to function has an odd length");
		createwarning("Error in foursquare, look at console", function() {
		});
		return -1;
	}
	var finalst = "";
	for ( var i = 0; i < what.length; i += 2) {
		var a = what[i];
		var b = what[i + 1];
		var sqposa = getsquarepos(a, key1);
		var sqposb = getsquarepos(b, key2);
		finalst += getsquareletter(sqposa[0], sqposb[1], key1);
		finalst += getsquareletter(sqposb[0], sqposa[1], key2);
	}
	return finalst;
}

function bruteforceplayf() {
	var bestscore = Infinity;
	var bestword = "";
	for ( var i = 0; i < allwords.length; i++) {
		var score = chisquared(solveplayfair(code, getbifidcode(allwords[i])));
		if (score < bestscore) {
			bestscore = score;
			bestword = allwords[i];
		}
	}
	return [ bestword, bestscore ];
}

function solveRailfence(key) {
    var load = true; // Whether the thing is going down or up
    var level = 0; //Where you are horizontally
    var steps = []; //The collection of steps
    for (var i = 0; i < code.length; i++) {
        if (steps[level] == undefined) {
            steps[level] = [];
        }
        steps[level].push(code[i]);
        if (load)
            level++;
        else
            level--;

        if (level == key - 1) 
            load = false;
        if (level == 0)
            load = true;
    }
    var retValue = "";
    for (var i = 0; i < key; i++) {
        retValue += steps[i].join("");
    }
    return retValue;
}