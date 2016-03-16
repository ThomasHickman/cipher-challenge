/// <reference path="All References.js" />
function bruteforceplayfair(initialkey, notest) {
    var bifidletters = "abcdefghiklmnopqrstuvwxyz";
    var maxst = chisquared(solveplayfair(code, initialkey));
    var maxcode = initialkey;
    var key = initialkey;
    var lower = "";
    var upper = initialkey;
    for (var o = 0; o < initialkey.length; o++) {
        for (var i = 0; i < bifidletters.length; i++) {
            /*key = key.split("");
            key[o] = alllowerletters[i];
            key = key.join("");*/
            key = lower + bifidletters[i] + remove(bifidletters[i], upper);
            if (chisquared(solveplayfair(code, key)) < maxst) {
                maxcode = key;
                maxst = chisquared(solveplayfair(code, key));
                console.log("New max st " + maxst + " code " + maxcode + " text " + solveplayfair(code, key));
            }
        }
        key = maxcode;
        lower = key.slice(0, o + 1);
        upper = key.slice(o + 1, key.length);
        bifidletters = remove(lower[lower.length - 1], bifidletters);
    }
    return maxcode + maxst;
}

function venerbruteforce() {
    var topnumber = 0; var topname = ""; for (var i = 0; i < allwords.length; i++) {
        if (IndexOfCoinsidence(solveletterkey(code, allwords[i].toUpperCase())) > topnumber) {
            topnumber = IndexOfCoinsidence(solveletterkey(code, allwords[i].toUpperCase()));
            topname = allwords[i];
            console.log("New Top :" + topname + " number " + topnumber);
        }
    }
}

function chisquared(what) {
    var result = 0;
    what = what.toUpperCase();
    var length = what.match(/[A-Z]/gi).length;
    for (var i = 0; i < allupperletters.length; i++) {
        result += Math.pow(countletters(allupperletters[i], what) - (RealLetterProb[i] / 100) * length, 2) / ((RealLetterProb[i] / 100) * length);
    }
    return result;
}

function findallwordstraight(word) {
    var workingwords = allwordssorted;
    while (true) {
        var currentwordpos = Math.floor((workingwords.length - 1) / 2);
        if (word == workingwords[currentwordpos]) {
            //The same
        }
        else if ([workingwords[currentwordpos], word].sort()[0] == word) {
            //Descard top
            workingwords = workingwords.slice(currentwordpos + 1, workingwords.length);
        }
        else {
            //Descard bottom
            workingwords = workingwords.slice(currentwordpos + 1, workingwords.length);
        }
    }
}


//Brute forces playfair with hill climbing
function bruteforceplayfair(what) {
    var bifidletters = "abcdefghiklmnopqrstuvwxyz";
    var prevst = "";
    for (var i = 0; i < 25/*bidfid letters length*/; i++) {
        //Go through all positions
        var bestscore = Infinity;
        var bestscoreletter = "_";//Error charater
        for (var o = 0; o < bifidletters.length; o++) {
            //Go though all letters
            var keysquare = getbifidcode(prevst + bifidletters[o]);
            var solution = solveplayfair(what, keysquare.toUpperCase());
            var fitness = chisquared(solution);
            if (fitness < bestscore) {
                bestscore = fitness;
                bestscoreletter = bifidletters[o];
            }
        }
        //Set last letter to the memory
        prevst += bestscoreletter;
        console.log("Best letter :" + bestscoreletter + " current keysqaure :" + getbifidcode(prevst));
        //Take current letter away from use
        bifidletters = remove(bestscoreletter, bifidletters);
    }
}

function findQuadram(word) {
    var startPos = 0;
    var endPos = quadrams.length - 1;
    while (true) {
        // 1) Fins half way point
        var posSearch = startPos + Math.floor((endPos - startPos) / 2);
        var found = quadrams[posSearch][0];
        if (found == word) {
            return [posSearch, quadrams[posSearch][1]];
        }
        if (startPos == posSearch /*|| endPos == posSearch*/) {
            return -1;
        }
        if ([found, word].sort()[0] == found) {
            startPos = posSearch;
        }
        else {
            endPos = posSearch;
        }
    }
}

function quadramRate(text) {
    var counts = [];
    var newpos = quadrams.length
    outerLoop:
    for (var i = 0; i < text.length - 3; i++) {
        var result = findQuadram(text.slice(i, i + 4));
        if (result == -1) {
            result = [newpos, 1];
            ++newpos;
        }
        for (var o = 0; o < counts.length; ++o) {
            if (counts[o][0] == result[0]) {
                counts[o][1]++;
                continue outerLoop;
            }
        }
        counts.push([result[0], result[1], 1]);
    }
    //Put the combinations together
    var sum = 0;
    for (var i = 0; i < counts.length; i++) {
        sum += Math.log(counts[i][2] / parseInt(counts[i][1]));
    }
    return sum;
}

function IndexOfCoinsidence(what) {
    var sum = 0;
    var length = what.match(/[A-Z]/gi).length;
    for (var i = 0; i < 26; i++) {
        var count = countletters(allupperletters[i], what.toUpperCase());
        sum += count * (count - 1);
    }
    return sum / (length * (length - 2));
}

//Encodes bigrams in a cipher to an indevisual code
function codebigrams(what, useletters) {
    if (what.length % 2 != 0) {
        console.log("Value passed to codebigrams is not an even length");
        return false;
    }
    var allbigrams = [];
    var finaltext = [];
    for (var i = 0; i < what.length; i += 2) {
        //Go through each bigram
        var bigram = what.slice(i, i + 2);
        //See if that bigram has come up before
        var isusedbefore = false;
        var positionused = 0;
        for (var o = 0; o < allbigrams.length; o++) {
            if (bigram == allbigrams[o]) {
                positionused = o;
                isusedbefore = true;
                break;
            }
        }
        if (isusedbefore) {
            if (useletters == undefined) {
                finaltext.push(positionused);
            }
            else {
                finaltext.push(allupperletters[positionused]);
            }
        }
        else {
            allbigrams.push(bigram);
            if (useletters == undefined) {
                finaltext.push(allbigrams.length -1);
            }
            else {
                finaltext.push(allupperletters[allbigrams.length - 1]);
            }
        }
    }
    return [finaltext, allbigrams];
}

function SimulatedAnnealing(what, sizeofkey, func) {
    function changest(st) {
        st = st.split("");
        var altst = st.slice();
        var pos1 = Math.floor(Math.random() * (altst.length));
        altst.splice(pos1, 1);
        var pos2 = st.indexOf(altst[Math.floor(Math.random() * (altst.length - 1))]);
        var pos1text = st[pos1];
        st[pos1] = st[pos2];
        st[pos2] = pos1text;
        console.log(pos1 + " " + pos2);
        return st.join("");
    }
    //1) Generate a Random Key
    var randomkey = "";
    var overallkey = allupperletters.split("");
    for (var i = 0; i < sizeofkey; i++) {
        var num = Math.floor(Math.random() * (overallkey.length-1));
        randomkey += overallkey[num];
        overallkey.splice(num, 1);
    }
    //2) Rate the fitness
    var fitness = IndexOfCoinsidence(func(what, randomkey));
    //3) For loop
    for (var T = 10; T >= 0; T == T - 0.2) {
        for (var o = 50000; o > 0; o--) {
            var newst = changest(randomkey);
            var impfitness = IndexOfCoinsidence(func(what, newst));
            var dF = impfitness - fitness;
            if (dF > 0) {
                randomkey = newst;
            }
            else {
                if (Math.pow(Math.E, dF / T) > 1) {
                    randomkey = newst;
                }
            }
        }
    }
}

