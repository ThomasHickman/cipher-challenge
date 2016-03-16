try{
    if (window[document] !== undefined) {
        var isWorker = false;
    }
    else {
        var isWorker = trueS;
    }
}
catch (e) {
    var isWorker = true;
}
if (isWorker)
    importScripts("../Data.js");

self.addEventListener('message', function (e) {
    var ret = spaceText.apply(this, e.data.values);
    postMessage({ type: "output", text: "Possible words: " + JSON.stringify(ret.possWords) });
    postMessage({ type: "return", text: ret.value });
});

function output(what) {
    if (isWorker)
        postMessage({ type: "output", text: what });
    else
        console.log(what);
}

function updateProgress(fraction) {
    if (isWorker)
        postMessage({ type: "update", text: fraction });
    else
        console.log(fraction * 100 + "%");
}

function iswholeword(word) {
    var startPos = 0;
    var endPos = allwordssorted.length - 1;
    var posSearch;
    while (true) {
        // 1) Fins half way point
        posSearch = startPos + ~~((endPos - startPos) / 2);
        var found = allwordssorted[posSearch];
        if (found == word) {
            return posSearch;
        }
        if (startPos == posSearch /*|| endPos == posSearch*/) {
            return -1;
        }
        if (found < word) {
            startPos = posSearch;
        }
        else {
            endPos = posSearch;
        }
    }
}

var tri = [];
for (var i = 0; i < code.length - 3; i++) {
    var in_tri = false;
    tri.forEach(function (el) {
        if (el[0] == code.slice(i, i + 3)) {
            el[1]++;
            in_tri = true;
        }
    })
    if(!in_tri ){
           tri.push([code.slice(i, i + 3), 1])
    }
}

function findwordsexactin(word, options) {
    if (options == undefined)
        options = new Object();
    var posValues = new Array();
    for (var i = 0; i < word.length; i++) {
        var retvalue = iswholeword(word.slice(0, i + 1).toLowerCase());
        if (retvalue != -1) {
            posValues.push([allwordssorted[retvalue], sortedOrder[retvalue]]);
        }
    }
    //Sort array
    posValues.sort(function (a, b) {
        return a[1] / a[0].length - b[1] / b[0].length;
    });
    if (!options.returnTwoValues) {
        //Extract the first values
        var extracted = new Array();
        for (i = 0; i < posValues.length; i++) {
            extracted.push(posValues[i][0]);
        }
        return extracted;
    }
    else {
        return posValues;
    }
}

function _SpaceTextReturnCorrect(Tree) {
    var finalst = "";
    for (var i = 0; i < Tree.branches.length; i++) {
        try {
            if (i != Tree.branches.length - 1) {
                finalst += Tree.branches[i].branch[0] + " ";
            }
            else {
                finalst += Tree.branches[i].branch[0];
            }
        }
        catch (e) {
        }
    }
    return {
        value: finalst,
        possWords: []
    };
}

/**
 * @param text - The text that is being used
 * @param options An object for options:<br>
 * 	<i>reSearch</i> - Search in-front to see if the trail can be picked back up<br>
 * 	<i>searchLimit</i> - The limit for the search boundary<br>
 * @returns false if no text is found, An object if it does:<br>
 * 	<i>value</i> - string of spaced text if it is.<br>
 * 	<i>possWords</i> - if reSearch has been enabled a list of skipped words<br>
 */
function spaceText(text, options) {
    if (options == undefined) {
        options = new Object();
    }
    var CurrWord;
    var offset = 0;
    var LENGTHTOTEST = 20;
    var Tree = new Object();
    Tree.levelon = -1;
    Tree.branches = [];
    var longeststring = "";
    var biggestoffset = 0;
    while (true) {
        //Update the progress
        updateProgress(offset / text.length);
        CurrWord = findwordsexactin(text.slice(offset, LENGTHTOTEST + offset));
        var wrongnext = false;
        if (CurrWord.length == 0 || wrongnext) {
            //None existent
            //See if a tree has been made
            if (Tree.levelon == -1) {
                return false;
            }
            if (Tree.branches[Tree.levelon].branch.length > 1) {
                //Delete failed branch
                Tree.branches[Tree.levelon].branch.splice(0, 1);
                //Go along the branch
                offset = Tree.branches[Tree.levelon].baseoffset + Tree.branches[Tree.levelon].branch[0].length;
                if (offset >= text.length) {
                    return _SpaceTextReturnCorrect(Tree);
                }
            }
            else {
                var PrintableValue = _SpaceTextReturnCorrect(Tree).values;
                try {
                    output("String: " + PrintableValue.length >= 20 ? "..." + PrintableValue.slice(20) : PrintableValue);
                }
                catch (e) {
                }
                if (Tree.branches.length <= 1 || (options.reSearch && biggestoffset - offset > 25)) {
                    if (options.reSearch) {
                        if (biggestoffset == 0) {
                            return false;
                        }
                        output("Applying Re-Search with " + text.slice(biggestoffset, 20 + biggestoffset) + " offset " + biggestoffset);
                        if (options.searchLimit == undefined)
                            //Default Value
                            options.searchLimit = 20;
                        var spaceTextValue = false;
                        for (var o = 1; o < options.searchLimit; o++) {
                            if (biggestoffset + o >= text.length) {
                                return {
                                    value: longeststring + " " + text.slice(biggestoffset).toLowerCase(),
                                    possWords: [text.slice(biggestoffset).toLowerCase()]
                                };
                            }
                            //var highestValue = findwordsexactin(text.slice(biggestoffset + o, LENGTHTOTEST + biggestoffset + o), {returnTwoValues: true})[0];

                            spaceTextValue = spaceText(text.slice(biggestoffset + o), options);
                            if (spaceTextValue != false) {
                                var stuckWord = text.slice(biggestoffset, biggestoffset + o);
                                return {
                                    value: longeststring + " " + stuckWord.toLowerCase() + " " + spaceTextValue.value,
                                    possWords: spaceTextValue.possWords.concat(stuckWord.toLowerCase())
                                };
                            }
                        }
                    }
                    else {
                        return false;
                    }
                }
                //Delete Branch
                Tree.branches.splice(Tree.branches.length - 1, 1);
                //Go down a level
                Tree.levelon--;
                //Delete Element
                Tree.branches[Tree.levelon].branch.splice(0, 1);
                //Go along the branch
                if (Tree.branches[Tree.levelon].branch.length == 0) {
                    wrongnext = true;
                }
                else {
                    offset = Tree.branches[Tree.levelon].baseoffset + Tree.branches[Tree.levelon].branch[0].length;
                }
                if (offset >= text.length) {
                    return _SpaceTextReturnCorrect(Tree);
                }
            }
        }
        else {
            //Exists
            //Add a new branch
            Tree.levelon++;
            Tree.branches[Tree.levelon] = {};
            Tree.branches[Tree.levelon].baseoffset = offset;
            Tree.branches[Tree.levelon].branch = CurrWord;
            //Set the offset
            offset += CurrWord[0].length;
            if (offset >= text.length) {
                return _SpaceTextReturnCorrect(Tree);
            }
            //Set the biggest offset
            if (options.reSearch) {
                if (biggestoffset < offset) {
                    biggestoffset = offset;
                    longeststring = _SpaceTextReturnCorrect(Tree).value;
                }
            }
        }
    }
}