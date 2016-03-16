/// <reference path="def.d.ts" />
var keyLengthsTest = 25;
module mathEx {
    export function convertexp(a) {
        var exponent = a[1];
        exponent += parseInt(a[0].toExponential().toString().split("e")[1]);
        var result = parseFloat(a[0].toExponential().toString().split("e")[0]);
        return [result, exponent];
    }
    export function factorial(num) {
        var c = [1 / 24, 3 / 80, 18029 / 45360, 6272051 / 14869008];
        var N = num + 0.5;
        var p = Math.pow(N, 2) / (N + c[0] / (N + c[1] / (N + c[2] / (N + c[3] / N))))
        var powerarg = power([p / Math.E, 0], N * 2);
        var sqrtvalue = sqrt(powerarg[0], powerarg[1]);
        return [Math.sqrt(2 * Math.PI) * sqrtvalue[0], sqrtvalue[1]];
    }
    export function sqrt(num, exp) {
        var sqrtnum = 1;
        var sqrtexp;
        if (exp == 0) {
            sqrtexp = 1;
        }
        else if (exp == 1) {
            sqrtexp = 10;
        }
        else if (exp == 2) {
            sqrtexp = Math.sqrt(10);
        }
        else {
            sqrtexp = Math.floor(exp / 2)
            sqrtnum = exp % 2 ? Math.sqrt(10) : 1;
        }
        sqrtnum *= Math.sqrt(num);
        return [sqrtnum, sqrtexp];
    }
    export function power(num, by) {
        if (by == 0) {
            return [1, 0];
        }
        if (by == 1)
            return num;
        if (by == 2)
            return convertexp([num[0] * num[0], num[1] * 2]);

        if (by % 2 == 0) {
            return power(power(num, by / 2), 2);
        }
        else {
            var part1 = power(power(num, (by - 1) / 2), 2);
            return convertexp([num[0] * part1[0], num[1] + part1[1]]);
        }
    }
    export function nCr(n, r) {
        return [factorial(n)[0] / (factorial(n - r)[0] * factorial(r)[0]), factorial(n)[1] - (factorial(n - r)[1] + factorial(r)[1])];
    }
    export function makeNormal(result: number[]) {
        return Math.round(result[0] * Math.pow(10, result[1]))
    }
}

function uniformArray<type>(elementToRepeat: type, times: number) {
    var retValue = <type[]>[];
    for (var i = 0; i < times; i++) {
        retValue.push(elementToRepeat);
    }
    return retValue;
}


module testers {
    var allTesters = <Tester[]>[];
    export class Tester {
        constructor(initData: { name: string; func: (text: string) => number; acceptableLimit: number; lessThan: boolean }) {
            this.name = initData.name;
            this.func = initData.func;
            this.acceptableLimit = initData.acceptableLimit;
            this.lessThan = initData.lessThan;
            allTesters.push(this);
        }
        func: (text: string) => number;
        name: string;
        lessThan: boolean;
        acceptableLimit: number;
    }
    function countletters(letter, text) {
        if (text == undefined) {
            text = code;
        }
        var sum = 0;
        for (var y = 0; y <= text.length - 1; y++) {
            if (text[y] == letter) {
                sum += 1;
            }
        }
        return sum;
    }
    export var chiSquared = new Tester({
        name: "Chi Squared",
        func: (what) => {
            var result = 0;
            what = what.toUpperCase();
            var length = what.match(/[A-Z]/gi).length;
            for (var i = 0; i < allupperletters.length; i++) {
                result += Math.pow(countletters(allupperletters[i], what) - (RealLetterProb[i] / 100) * length, 2) / ((RealLetterProb[i] / 100) * length);
            }
            return result;
        },
        acceptableLimit: 100,
        lessThan: true
    });
    export function findQuadram(word: string): number {
        var startPos = 0;
        var endPos = quadrams.length - 1;
        while (true) {
            // 1) Fins half way point
            var posSearch = startPos + ~~((endPos - startPos) / 2); //~~ === Math.floor
            var found = quadrams[posSearch][0];
            if (found == word) {
                return quadrams[posSearch][1];
            }
            if (startPos == posSearch /*|| endPos == posSearch*/) {
                return 0;
            }
            if (found < word) {
                startPos = posSearch;
            }
            else {
                endPos = posSearch;
            }
        }
    }
    declare var bigramsSorted: [any][];
    export function findBigram(word: string): number {
        var startPos = 0;
        var endPos = bigramsSorted.length - 1;
        while (true) {
            // 1) Fins half way point
            var posSearch = startPos + ~~((endPos - startPos) / 2); //~~ === Math.floor
            var found = bigramsSorted[posSearch][0];
            if (found == word) {
                return bigramsSorted[posSearch][1];
            }
            if (startPos == posSearch /*|| endPos == posSearch*/) {
                return 0;
            }
            if (found < word) {
                startPos = posSearch;
            }
            else {
                endPos = posSearch;
            }
        }
    }
    var casheText = ["", 0];
    export var bigramRate = new Tester({
        name: "Bigram Rate",
        func: (text) => {
            var sum = 0;
            var endPoint = text.length - 1;
            for (var i = 0; i < endPoint; ++i) {// findBigram(text.slice(i, i + 2)) 
                sum += bigramsSorted[26 * toLetterCode(text[i]) + toLetterCode(text[i + 1])][1]
            }
            //Put the combinations together
            return sum / 10000;
        },
        acceptableLimit: 0.3,
        lessThan: false
    });
    export var quadramRate = new Tester({
        name: "Quadram Rate",
        func: (text) => {
            var sum = 0;
            var endPoint = text.length - 3;
            for (var i = 0; i < endPoint; ++i) {
                sum += findQuadram(text.slice(i, i + 4));
            }
            //Put the combinations together
            return sum / 10000;
        },
        acceptableLimit: -1000,
        lessThan: true
    });
    export var longQuadramRate = new Tester({
        name: "Long Quadram Rate",
        func: (text) => {
            var sum = 0;
            var endPoint = text.length - 3;
            for (var i = 0; i < endPoint; ++i) {
                sum += longQuadrams[toLetterCode(text[0]) * 17576 + toLetterCode(text[1]) * 676 + toLetterCode(text[2]) * 26 + toLetterCode(text[3])];
            }
            //Put the combinations together
            return sum;
        },
        acceptableLimit: -1000,
        lessThan: true
    });
    export var quadramAndChi = new Tester({
        name: "A Mixture of the quadram rate and Chi-Squared rating",
        lessThan: true,
        acceptableLimit: 500,
        func: (what) => 100
    });
    export var matchWords = new Tester({
        name: "Match Real Words",
        func: (what) => {
            var result = 0;
            what = what.toUpperCase();
            var length = what.match(/[A-Z]/gi).length;
            for (var i = 0; i < allupperletters.length; i++) {
                result += Math.pow(countletters(allupperletters[i], what) - (RealLetterProb[i] / 100) * length, 2) / ((RealLetterProb[i] / 100) * length);
            }
            return result;
        },
        acceptableLimit: 100,
        lessThan: true
    });
}

module solvers {
    export interface Reporter {
        setOriginalText(originalText: string);
        start(numIncrement: number);
        update(toWhat: number);
        finish(plainText: string, key: any, strength: number);
        log(what: string);
        error(what: string);
    }

    export class _ConsoleReporter implements Reporter {
        numIncrement: number;
        incrementOn = 0;
        originalText: string;

        setOriginalText = (originalText: string) => {
            this.originalText = originalText;
        }
        start = (numIncrement: number) => {
            this.numIncrement = numIncrement;
        }
        update = (toWhat = ++this.incrementOn) => {
            console.log("Completed " + Math.floor((toWhat / this.numIncrement) * 100) + "%");
        }
        finish = (plainText: string, key: any, strength: number) => {
            console.log("Task Finished");
            console.log(plainText);
            console.log("Strength: " + strength);
            console.log("Key: " + key);
        }
        log = (what: string) => {
            console.log(what);
        }
        error = (what: string) => {
            console.error(what);
        }
    };
    export var ConsoleReporter = new _ConsoleReporter();
    export class _ProgessReporter extends _ConsoleReporter implements Reporter {
        log = (what: string) => {
        }
    };
    export class _OtherReporter extends _ConsoleReporter implements Reporter {
        log = (what: string) => {
        }
        finish = (plainText: string, key: any, strength: number) => {
            if (strength > 0.33) {
                console.log("Task Finished");
                console.log(plainText);
                console.log("Strength: " + strength);
                console.log("Key: " + key);
                //console.log(permutations);
            }
            else if (strength > 0.3) {
                console.log("Strength: " + strength);
                console.log("Key: " + key);
                //console.log(permutations);
            }
        }
    };
    export var OtherReporter = new _OtherReporter();
    export var ProgressReporter = new _ProgessReporter();
    export interface SolverParams {
        name: string;
        func: (cipherText: string, cipher: ciphers.Cipher<any>, tester: testers.Tester, reporter: Reporter, settings: SolverSettings) => string;
    }
    var allSolvers = <Solver[]>[];
    export class Solver {
        constructor(initInfo: SolverParams) {
            this.name = initInfo.name;
            this.func = (cipherText: string, cipher: ciphers.Cipher<any>, tester: testers.Tester, reporter: Reporter, settings: SolverSettings) => {
                if (cipherText == "")
                    throw Error("Cannot solve a code of length 0");
                if (cipher.keyInfo.changeParameters !== undefined) {
                    if (settings.keyLength === undefined) {
                        throw new Error("Need to specify a length!");
                    }
                    cipher.keyInfo.changeParameters(settings.keyLength);
                }
                reporter.setOriginalText(cipherText);
                return allCapsToFormattedText(initInfo.func(formattedTextToAllCaps(cipherText), cipher, tester, reporter, settings), cipherText);
            }
            allSolvers.push(this);
        }
        func: (cipherText: string, cipher: ciphers.Cipher<any>, tester: testers.Tester, reporter: Reporter, settings: SolverSettings) => string;
        name: string;
    }
    export interface SolverSettings {
        useLowestValue?: boolean;
        initKey?: any;
        needToPassBenchmark?: boolean
        iterations?: number;
        outerIterations?: number;
        keyLength?: number;
        testingLimit: number;
    }
    var prevRndNum = 0;
    function quickRandom() {
        return randomArray[~~(prevRndNum * 100)];
    }
    function clone<type>(obj: type)  {
        if (obj == null || typeof (obj) != 'object')
            return obj;

        var temp = obj.constructor(); // changed

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                temp[key] = clone(obj[key]);
            }
        }
        return <type>temp;
    }
    export var bruteForce = new Solver({
        name: "Brute Force",
        func: (cipherText: string, cipher: ciphers.Cipher<any>, tester: testers.Tester, reporter: Reporter, settings: SolverSettings) => {
            var currentKey = cipher.keyInfo.startGen();
            var lowestValue = 0;
            var lowestKey = 0;
            reporter.start(cipher.keyInfo.occurences);
            for (var i = 0; i < cipher.keyInfo.occurences; i++) {
                if (i != 0) {
                    currentKey = cipher.keyInfo.generator(currentKey);
                }
                var decryptingValue = cipher.nonFormatting.decrypt(cipherText, currentKey);
                var rating = tester.func(decryptingValue);
                reporter.log("Current Key: " + currentKey + ", decrypting to " + decryptingValue + ", rating: " + rating);
                if (i % 300 == 1)
                    reporter.update(i);
                if ((rating < lowestValue == tester.lessThan) || lowestValue == 0) {
                    lowestValue = rating;
                    lowestKey = clone(currentKey); 
                }
                if(!settings.useLowestValue) {
                    if (rating < tester.acceptableLimit == tester.lessThan) {
                        reporter.finish(decryptingValue, currentKey, rating);
                        return decryptingValue;
                    }
                }
            }
            if (!settings.useLowestValue) {
                reporter.error("No value was found to have the correct statistics");
            }
            reporter.finish(cipher.nonFormatting.decrypt(cipherText, lowestKey), lowestKey, lowestValue);
            return cipher.nonFormatting.decrypt(cipherText, lowestKey);
        }
    });
    export var dictionaryAttack = new Solver({
        name: "Dictionary Attack",
        func: <t>(cipherText: string, cipher: ciphers.Cipher<t>, tester: testers.Tester, reporter: Reporter, settings?: SolverSettings) => {
            settings = setDefault({
                needToPassBenchmark: true
            }, settings);
            var best = 0;
            var bestSt = "";
            allwords.forEach((el) => {
                el = el.toUpperCase();
                var solved = cipher.decrypt(code, el);
                var score = tester.func(solved);
                if (score < best) {
                    best = score;
                    bestSt = el;
                    reporter.log("Found better key: " + bestSt);
                    reporter.log("Text: " + solved.slice(0, 100) + "...");
                    if (settings.needToPassBenchmark && (best < tester.acceptableLimit == tester.lessThan)) {
                        reporter.finish(cipher.decrypt(code, bestSt), bestSt, best);
                        return cipher.decrypt(code, bestSt);
                    }
                }
            });
            reporter.finish(cipher.decrypt(code, bestSt), bestSt, best);
            return cipher.decrypt(code, bestSt);
        }
    });
    export var churn = new Solver({
        name: "Hill Climbing",
        func: <t>(cipherText: string, cipher: ciphers.Cipher<t>, tester: testers.Tester, reporter: Reporter, settings?: SolverSettings) => {
            settings = setDefault({
                needToPassBenchmark: true,
                initKey: cipher.keyInfo.startRnd(),
                outerIterations: 20,
                iterations: 1000,
                testingLimit: 10
            }, settings);
            var cipherTextShort = cipherText;
            var key: t;
            var highestResult;
            var decrypted: string;
            var result: number;
            var iterOn = 0;
            var newKey: t;
            var bestIteration = {
                result: tester.lessThan ? Infinity : -Infinity,
                key: <t>null,
            };
            //key = settings.initKey == undefined ? cipher.keyInfo.startRnd() : settings.initKey
            for (var iterations = 0; iterations < settings.outerIterations; iterations++) {
                key = settings.initKey;
                highestResult = {
                    result: /*tester.lessThan ? Infinity : -Infinity*/tester.func(cipher.nonFormatting.decrypt(cipherTextShort, key)),
                    key: key
                };
                for (var i = 0; i < settings.iterations; i++) {
                    newKey = cipher.keyInfo.change(key);
                    decrypted = cipher.nonFormatting.decrypt(cipherTextShort, newKey);
                    result = tester.func(decrypted);
                    var rndNum = Math.floor(Math.random() * settings.testingLimit);
                    if (result < highestResult.result + rndNum == tester.lessThan) {
                        i = 0;
                        iterOn++;
                        key = _.cloneDeep(newKey);
                        reporter.log("Found better key: " + key);
                        reporter.log("Text: " + decrypted.slice(0, 100) + "...");
                        highestResult.key = _.cloneDeep(key);
                        highestResult.result = result;
                    }
                }
                reporter.finish(cipher.nonFormatting.decrypt(cipherText, highestResult.key), highestResult.key, highestResult.result);
                if (!settings.needToPassBenchmark && !settings.useLowestValue) {
                    bestIteration = highestResult;
                    break;
                }
                else if (bestIteration.result > highestResult.result == tester.lessThan) {
                    bestIteration = highestResult;
                    if (settings.needToPassBenchmark && (bestIteration.result < tester.acceptableLimit == tester.lessThan)) {
                        return cipher.nonFormatting.decrypt(cipherText, bestIteration.key);
                    }
                }
                key = cipher.keyInfo.startRnd();
            }
            if (settings.needToPassBenchmark) {
                reporter.error("Cannot get highest result");
                reporter.finish(cipher.nonFormatting.decrypt(cipherText, bestIteration.key), bestIteration.key, tester.func(cipher.nonFormatting.decrypt(cipherText, bestIteration.key)));
            }
            return cipher.nonFormatting.decrypt(cipherText, bestIteration.key);
        }
    });
    export var hillClimbing = new Solver({
        name: "Hill Climbing",
        func: <t>(cipherText: string, cipher: ciphers.Cipher<t>, tester: testers.Tester, reporter: Reporter, settings?: SolverSettings) => {
            settings = setDefault({
                needToPassBenchmark: true,
                initKey: cipher.keyInfo.startRnd(),
                outerIterations: 20,
                iterations: 1000
            }, settings);
            var cipherTextShort = cipherText;
            var key: t;
            var highestResult;
            var decrypted: string;
            var result: number;
            var iterOn = 0;
            var newKey: t;
            var bestIteration = {
                result: tester.lessThan ? Infinity : -Infinity,
                key: <t>null,
            };
            //key = settings.initKey == undefined ? cipher.keyInfo.startRnd() : settings.initKey
            for (var iterations = 0; iterations < settings.outerIterations; iterations++) {
                key = settings.initKey;
                highestResult = {
                    result: /*tester.lessThan ? Infinity : -Infinity*/tester.func(cipher.nonFormatting.decrypt(cipherTextShort, key)),
                    key: key
                };
                for (var i = 0; i < settings.iterations; ++i) {
                    newKey = cipher.keyInfo.change(key);
                    decrypted = cipher.nonFormatting.decrypt(cipherTextShort, newKey);
                    result = tester.func(decrypted);
                    if (result < highestResult.result == tester.lessThan) {
                        i = 0;
                        iterOn++;
                        key = _.cloneDeep(newKey);
                        reporter.log("Found better key: " + key);
                        reporter.log("Text: " + decrypted.slice(0, 100) + "...");
                        highestResult.key = _.cloneDeep(key);
                        highestResult.result = result;
                    }
                }
                reporter.finish(cipher.nonFormatting.decrypt(cipherText, highestResult.key), highestResult.key, highestResult.result);
                if (!settings.needToPassBenchmark && !settings.useLowestValue) {
                    bestIteration = highestResult;
                    break;
                }
                else if (bestIteration.result > highestResult.result == tester.lessThan) {
                    bestIteration = highestResult;
                    if (settings.needToPassBenchmark && (bestIteration.result < tester.acceptableLimit == tester.lessThan)) {
                        return cipher.nonFormatting.decrypt(cipherText, bestIteration.key);
                    }
                }
                key = cipher.keyInfo.startRnd();
            }
            if (settings.needToPassBenchmark) {
                reporter.error("Cannot get highest result");
                reporter.finish(cipher.nonFormatting.decrypt(cipherText, bestIteration.key), bestIteration.key, tester.func(cipher.nonFormatting.decrypt(cipherText, bestIteration.key)));
            }
            return cipher.nonFormatting.decrypt(cipherText, bestIteration.key);
        }
    });
    export var simmulatedAnnerling = new Solver({
        name: "Simulated Annerling",
        func: <t>(cipherText: string, cipher: ciphers.Cipher<t>, tester: testers.Tester, reporter: Reporter, settings: SolverSettings) => {
            var key = cipher.keyInfo.startRnd();
            var highestResult = {
                result: tester.lessThan ? Infinity : -Infinity,
                key: key
            }
            var decrypted: string;
            var result: number;
            var iterOn = 0;
            var newKey: t;
            for (var temp = 10; temp >= 0; temp -= 0.5) {
                for (var i = 0; i < 10000; i++) {
                    newKey = cipher.keyInfo.change(key);
                    decrypted = cipher.nonFormatting.decrypt(cipherText, newKey);
                    result = tester.func(decrypted);
                    if ((result < highestResult.result == tester.lessThan)) {
                        iterOn++;
                        reporter.log("Found better key: " + key);
                        reporter.log("Text: " + decrypted.slice(0, 100) + "...");
                        key = newKey;
                        highestResult.key = key;
                        highestResult.result = result;
                    }
                    else if ((Math.exp((highestResult.result - result) / (temp * 2))) > quickRandom()) {
                        iterOn++;
                        reporter.log("Found better key: " + key);
                        reporter.log("Down one level");
                        reporter.log("Text: " + decrypted.slice(0, 100) + "...");
                        key = newKey;
                        highestResult.key = key;
                        highestResult.result = result;
                    }
                }
                reporter.log("Temp --:" + temp);
            }
            reporter.finish(cipher.nonFormatting.decrypt(cipherText, highestResult.key), highestResult.key, tester.func(cipher.nonFormatting.decrypt(cipherText, highestResult.key)));
            return cipher.nonFormatting.decrypt(cipherText, highestResult.key);
        }
    });
}

function formattedTextToAllCaps(input: string) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        var charCode = input[i].charCodeAt(0);
        if (charCode >= 97 /*a*/ && charCode <= 122 /*z*/) {
            output += String.fromCharCode(charCode - 32);
        }
        else if (charCode >= 65 /*A*/ && charCode <= 90 /*Z*/) {
            output += input[i];
        }
        else {
            //Nothing
        }
    }
    return output;
}

function cribPlayFairKey(crib: string, input: string) {
    var keySquare = [];
    for (var i = 0; i < 5; i++) {
        keySquare.push([])
        for (var c = 0; c < 5; c++) {
            keySquare[i].push("");
        }
    }
    for (var i = 0; i < input.length - 2; i++) {
    }
}

function allCapsToFormattedText(input: string, original: string) {
    var output = "";
    var inputNumOn = 0;
    for (var i = 0; i < input.length; i++) {
        var charCode = original[i].charCodeAt(0);
        if (charCode >= 97 /*a*/ && charCode <= 122 /*z*/) {
            output += input[inputNumOn++].toLowerCase();
        }
        else if (charCode >= 65 /*A*/ && charCode <= 90 /*Z*/) {
            output += input[inputNumOn++].toUpperCase();
        }
        else {
            output += original[i];
        }
    }
    return output;
}


var biG = {}; for (var i = 0; i < code.length; i++) {
    if (biG[code.slice(i, i + 2)] == undefined)
        biG[code.slice(i, i + 2)] = 1;
    else
        biG[code.slice(i, i + 2)]++
}

var toLetterCode = (letter: string) => letter.charCodeAt(0) - 65;
var fromLetterCode = (num: number) => String.fromCharCode(num + 65);

module ciphers {
    export function pageLoad() {
        allCiphers.sort((cipherA, cipherB) => cipherA.keyInfo.occurences - cipherB.keyInfo.occurences);
    }
    //Keys
    export module keyRanges {
        export function numbers(min: number, max: number): cipherKeyInfo<number> {
            return {
                startGen: () => min,
                generator: (input: number) => input + 1,
                occurences: max - min,
                change: (prev) => {
                    console.error("Not Implemented");
                    return prev
                },
            }
        }
        export class repeatedBaseClass<type>{
            constructor(selectionArr: type, keyLength) {
                this.changeParameters(keyLength, selectionArr);
            }
            changeParameters(newLength: number, selectionArr: type) {
                if (selectionArr !== undefined)
                    this.selectionArr = selectionArr;
                if (newLength !== undefined) {
                    this.keyLength = newLength;
                    this.occurences = Math.pow(conv<Array<any>>(this.selectionArr).length, newLength);
                }
            }
            keyLength = 5;
            selectionArr: type;
            occurences: number;
        }
        export class repeatedCharaters<type> extends repeatedBaseClass<type[]> implements cipherKeyInfo<Array<type>> {
            constructor(selectionArr: type[], keyLength = 5) {
                super(selectionArr, keyLength);
            }
            startGen() {
                var retSt = [];
                for (var i = 0; i < this.keyLength; i++) {
                    retSt.push(this.selectionArr[0]);
                }
                return retSt;
            }
            startRnd() {
                var retSt = [];
                for (var i = 0; i < this.keyLength; i++) {
                    retSt.push(this.selectionArr[Math.floor(Math.random() * this.selectionArr.length)]);
                }
                return retSt;
            }
            generator(input: type[]) {
                var retValue = input;
                var currentProc = 0;
                while (true) {
                    var index = this.selectionArr.indexOf(retValue[currentProc]);
                    if (index < this.selectionArr.length - 1) {
                        retValue[currentProc] = this.selectionArr[index + 1];
                        break;
                    }
                    else {
                        retValue[currentProc] = this.selectionArr[0];
                        currentProc++;
                    }
                }
                return retValue;
            }
            change(prev: type[]) {
                var retValue = prev;
                var pos = Math.floor(Math.random() * this.keyLength);
                retValue[pos] = this.selectionArr[Math.floor(Math.random() * this.selectionArr.length)];
                return retValue;
            }
        }
        export class repeatedNumbers extends repeatedCharaters<number>{
            constructor(range: { from: number; to: number }, keyLength = 5) {
                //TODO: Potential performence improvement here - remove the inherited class's indexOf
                var selectionArr = <number[]>[];
                for (var i = range.from; i < range.to; i++) {
                    selectionArr.push(i);
                }
                super(selectionArr, keyLength);
            }
        }
        export class repeatedLetters extends repeatedBaseClass<string>  implements cipherKeyInfo<string> {
            constructor(selectionArr: string, keyLength = 5) {
                super(selectionArr, keyLength);
            }
            startGen() {
                var retSt = "";
                for (var i = 0; i < this.keyLength; i++) {
                    retSt += this.selectionArr[0];
                }
                return retSt;
            }
            startRnd() {
                var retSt = "";
                for (var i = 0; i < this.keyLength; i++) {
                    retSt += fromLetterCode(Math.floor(Math.random() * this.selectionArr.length));
                }
                return retSt;
            }
            generator(input: string) {
                var retValue = input.split("");
                var currentProc = 0;
                while (true) {
                    var charCode = retValue[currentProc].charCodeAt(0);
                    if (charCode <= 63 + this.selectionArr.length) {
                        retValue[currentProc] = String.fromCharCode(charCode + 1);
                        break;
                    }
                    else {
                        retValue[currentProc] = this.selectionArr[0];
                        currentProc++;
                    }
                }
                return retValue.join("");
            }
            change(prev: string) {
                var retValue = prev.split("");
                var pos = Math.floor(Math.random() * this.keyLength);
                retValue[pos] = this.selectionArr[Math.floor(Math.random() * this.selectionArr.length)];
                return retValue.join("");
            }
        }/*
        export function arrangementOfAlphebet(text = allupperletters): cipherKeyInfo<string> {
            function nextPermutation(array) {
                // Find non-increasing suffix
                var i = array.length - 1;
                while (i > 0 && array[i - 1] >= array[i])
                    i--;
                if (i <= 0)
                    return false;

                // Find successor to pivot
                var j = array.length - 1;
                while (array[j] <= array[i - 1])
                    j--;
                var temp = array[i - 1];
                array[i - 1] = array[j];
                array[j] = temp;

                // Reverse suffix
                j = array.length - 1;
                while (i < j) {
                    temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                    i++;
                    j--;
                }
                return array;
            }
            return {
                startGen: () => {
                    return text
                },
                startRnd: () => {
                    var retValue = [];
                    var tmpTextCopy = text.split("");
                    for (var i = 0; i < text.length; i++) {
                        var rndPos = Math.floor(Math.random() * tmpTextCopy.length);
                        retValue.push(tmpTextCopy[rndPos]);
                        tmpTextCopy.splice(rndPos, 1);
                    }
                    return retValue.join("");
                },
                generator: (prev: string) => {
                    return nextPermutation(prev.split("").map((el) => el.charCodeAt(0) - 97)).map((el) => String.fromCharCode(el + 97)).join("")
                },
                change: (prev) => {
                    var buffer = '';
                    var retValue = prev.split("");
                    var rnd = Math.floor(Math.random() * 26);
                    var rnd2 = Math.floor(Math.random() * 25);
                    if (rnd2 >= rnd)
                        rnd2++
                    buffer = retValue[rnd];
                    retValue[rnd] = retValue[rnd2];
                    retValue[rnd2] = buffer;
                    return retValue.join("");
                },
                occurences: 4.0329146112660716e+26
            }
        }*/
        function orderedArray(upTo: number) {
            var retValue = <number[]>[];
            for (var i = 0; i < upTo; i++) {
                retValue.push(i + 1);
            }
            return retValue;
        }
        function nextPermutation<t>(array: t[]) {
            // Find non-increasing suffix
            var i = array.length - 1;
            while (i > 0 && array[i - 1] >= array[i])
                i--;
            if (i <= 0)
                return [];

            // Find successor to pivot
            var j = array.length - 1;
            while (array[j] <= array[i - 1])
                j--;
            var temp = array[i - 1];
            array[i - 1] = array[j];
            array[j] = temp;

            // Reverse suffix
            j = array.length - 1;
            while (i < j) {
                temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                i++;
                j--;
            }
            return array;
        }
        export class arrangementOfLetters implements cipherKeyInfo<string>{
            occurences: number;
            private text: string;
            fixedLength: number;
            constructor(initialText: string) {
                this.text = initialText;
                this.fixedLength = initialText.length;
                this.occurences = mathEx.makeNormal(mathEx.factorial(initialText.length));
            }
            startGen() {
                return this.text;
            }
            startRnd() {
                var retValue = [];
                var tmpTextCopy = this.text.split("")
                for (var i = 0; i < this.text.length; i++) {
                    var rndPos = Math.floor(Math.random() * tmpTextCopy.length);
                    retValue.push(tmpTextCopy[rndPos]);
                    tmpTextCopy.splice(rndPos, 1);
                }
                return retValue.join("");
            }
            generator(prev: string) {
                return nextPermutation(prev.split("")).join("");
            }
            change(prev: string) {
                var arr = prev.split("");
                var buffer = "";
                var retValue = arr;
                var rnd = Math.floor(Math.random() * this.text.length);
                var rnd2 = Math.floor(Math.random() * this.text.length);
                buffer = retValue[rnd];
                retValue[rnd] = retValue[rnd2];
                retValue[rnd2] = buffer;
                return retValue.join("");
            }/*
            converstions = [{
                typeFrom: "string",
                convert: (from: string) => {
                    var fromArr = from.split("");
                    var charCodes = fromArr.map((el) => el.charCodeAt(0));
                    charCodes.sort((a, b) => a - b);
                    var retValue = <number[]>[];
                    fromArr.forEach((el) => retValue.push(charCodes.indexOf(el.charCodeAt(0))))
                    return retValue.map((el) => el + 1);
                }
            }]*/
        }
        export class arrangementOfNumbers implements cipherKeyInfo<number[]>{
            keyLength: number;
            occurences: number;
            private text: number[];
            constructor(keyLength = 0) {
                this.changeParameters(keyLength);
            }
            changeParameters(newLength: number) {
                this.keyLength = newLength;
                this.occurences = mathEx.makeNormal(mathEx.factorial(newLength));
                this.text = orderedArray(this.keyLength);
            }
            startGen() {
                return this.text; 
            }
            startRnd() {
                var retValue = [];
                var tmpTextCopy = this.text.slice(0)//Hard Copy;
                for (var i = 0; i < this.text.length; i++) {
                    var rndPos = Math.floor(Math.random() * tmpTextCopy.length);
                    retValue.push(tmpTextCopy[rndPos]);
                    tmpTextCopy.splice(rndPos, 1);
                }
                return retValue;
            }
            generator (prev: number[]){
                return nextPermutation(prev);
            }
            change (prev: number[]) {
                var buffer = 0;
                var retValue = prev;
                var rnd = Math.floor(Math.random() * this.keyLength);
                var rnd2 = Math.floor(Math.random() * this.keyLength);
                buffer = retValue[rnd];
                retValue[rnd] = retValue[rnd2];
                retValue[rnd2] = buffer;
                return retValue;
            }
            converstions = [{
                typeFrom: "string",
                convert: (from: string) => {
                    var fromArr = from.split("");
                    var charCodes = fromArr.map((el) => el.charCodeAt(0));
                    charCodes.sort((a, b) => a - b);
                    var retValue = <number[]>[];
                    fromArr.forEach((el) => retValue.push(charCodes.indexOf(el.charCodeAt(0))))
                    return retValue.map((el) => el + 1);
                }
            }]
        }
        /*export function arrangementOfNumbers(keyLength = 5): cipherKeyInfo<number[]> {
            function nextPermutation(array: number[]) {
                // Find non-increasing suffix
                var i = array.length - 1;
                while (i > 0 && array[i - 1] >= array[i])
                    i--;
                if (i <= 0)
                    return [];

                // Find successor to pivot
                var j = array.length - 1;
                while (array[j] <= array[i - 1])
                    j--;
                var temp = array[i - 1];
                array[i - 1] = array[j];
                array[j] = temp;

                // Reverse suffix
                j = array.length - 1;
                while (i < j) {
                    temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                    i++;
                    j--;
                }
                return array;
            }
            return {
                startGen: () => {
                    return text
                },
                startRnd: () => {
                    var retValue = [];
                    var tmpTextCopy = text;
                    for (var i = 0; i < text.length; i++) {
                        var rndPos = Math.floor(Math.random() * tmpTextCopy.length);
                        retValue.push(tmpTextCopy[rndPos]);
                        tmpTextCopy.splice(rndPos, 1);
                    }
                    return retValue;
                },
                generator: (prev: number[]) => {
                    return nextPermutation(prev);
                },
                change: (prev) => {
                    var buffer = 0;
                    var retValue = prev;
                    var rnd = Math.floor(Math.random() * 26);
                    var rnd2 = Math.floor(Math.random() * 25);
                    if (rnd2 >= rnd)
                        rnd2++
                    buffer = retValue[rnd];
                    retValue[rnd] = retValue[rnd2];
                    retValue[rnd2] = buffer;
                    return retValue;
                },
                converstions: [{
                    typeFrom: "string",
                    convert: (from: string) => {
                        var fromArr = from.split("");
                        var charCodes = fromArr.map((el) => el.charCodeAt(0));
                        charCodes.sort((a, b) => a - b);
                        var retValue = <number[]>[];
                        fromArr.forEach((el) => retValue.push(charCodes.indexOf(el.charCodeAt(0))))
                        return retValue.map((el) => el+1);
                    }
                }],
                occurences: 4.0329146112660716e+26,
            }
        }*/
    }
    export interface cipherKeyInfo<type> {
        startGen: () => type;
        startRnd?: () => type;
        generator: (input: type) => type;
        occurences: number;
        change?: (prev: type) => type;
        converstions?: {
            typeFrom: string;
            convert: (from: any) => type
        }[];
        changeParameters?: Function;
        fixedLength?: number;
    }
    //Globals
    export var allCiphers = <Array<Cipher<any>>>[];
    //Cipher Class
    export interface solvedCipherInfo<keyType> {
        key: keyType;
        solution: string;
    }
    export interface CipherProps<keyType> {
        name: string;
        encrypt: (input: string, key: keyType) => string;
        decrypt: (input: string, key: keyType) => string;
        keyInfo: cipherKeyInfo<keyType>;
    }
    export class Cipher<keyType>{
        private testKeyType(key: any, initInfo: CipherProps<keyType>) {
            var mappedKey = key;
            if (typeof (key) == "string") {
                mappedKey = (<string>mappedKey.toUpperCase());
            }
            if (initInfo.keyInfo.converstions !== undefined) {
                if (typeof (key) !== typeof (initInfo.keyInfo.startGen())) {
                    initInfo.keyInfo.converstions.every((el) => {
                        if (el.typeFrom == typeof (key)) {
                            mappedKey = el.convert(mappedKey);
                            return false;
                        }
                        return true;
                    });
                }
            }
            return <keyType>mappedKey;
        }
        constructor(initInfo: CipherProps<keyType>) {
            allCiphers.push(this);
            this.decrypt = (input: string, key: any) => {
                return allCapsToFormattedText(initInfo.decrypt(formattedTextToAllCaps(input), this.testKeyType(key, initInfo)), input)
            };
            this.encrypt = (input: string, key: any) => {
                return allCapsToFormattedText(initInfo.encrypt(formattedTextToAllCaps(input), this.testKeyType(key, initInfo)), input);
            }
            this.keyInfo = initInfo.keyInfo;
            this.name = initInfo.name;
            this.nonFormatting = {
                decrypt: initInfo.decrypt,
                encrypt: initInfo.encrypt
            }
        }
        name: string;
        encrypt: (input: string, key: any) => string;
        decrypt: (input: string, key: any) => string;
        nonFormatting: {
            encrypt: (input: string, key: keyType) => string;
            decrypt: (input: string, key: keyType) => string;
        }
        solve: (x: void) => solvedCipherInfo<keyType>;
        keyInfo: cipherKeyInfo<keyType>;
    }
    function forEachLetterFromSt(input: string, func: (inp: string, pos: number) => number) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            output += String.fromCharCode(func(input[i], i) + 65);
        }
        return output;
    }

    function forEachLetterToSt(input: string, func: (inp: number, pos: number) => string) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            var charCode = input[i].charCodeAt(0);
            output += func(charCode - 65, i);
        }
        return output;
    }

    function forEachLetter(input: string, func: (inp: number, pos: number) => number) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            var charCode = input[i].charCodeAt(0);
            output += String.fromCharCode(func(charCode - 65, i) + 65);
        }
        return output;
    }

    export var cMod = (num: number, amount: number) => num > 0 ? num % amount : (amount + ((num) % amount)) % amount;

    export var caesarShift = new Cipher<number>({
        name: "Caesar Shift",
        keyInfo: keyRanges.numbers(0, 25),
        encrypt: (input: string, key: number) => forEachLetter(input, (inp: number) => cMod((inp + key), 26)),
        decrypt: (input: string, key: number) => forEachLetter(input, (inp: number) => cMod((inp - key), 26))
    });

    var hillCiphersInverses = [NaN, 1, NaN, 9, NaN, 21, NaN, 15, NaN, 3, NaN, 19, NaN, NaN, NaN, 7, NaN, 23, NaN, 11, NaN, 5, NaN, 17, NaN, 25];

    export var hillCipher = new Cipher<number[]>({
        name: "Hill Cipher",
        keyInfo: new keyRanges.repeatedNumbers({ from: 0, to: 25 }),
        encrypt: (input: string, key: number[]) => {
            var retValue = "";
            var matrixDimentions = Math.sqrt(key.length);
            if (input.length % matrixDimentions !== 0)
                throw Error("Input not a muliple of " + matrixDimentions);
            for (var i = 0; i < input.length; i += 2) {
                var nGram = input.slice(i, i + matrixDimentions).split("");
                var numNGram = nGram.map((el) => toLetterCode(el));
                for (var x = 0; x < matrixDimentions; x++) {
                    var sum = 0;
                    for (var y = 0; y < matrixDimentions; y++) {
                        sum += key[y + x * matrixDimentions] * numNGram[y];
                    }
                    retValue += fromLetterCode(cMod(sum, 26));
                }
            }
            return retValue;
        },
        decrypt: (input: string, key: number[]) => {
            var retValue = "";
            if (input.length % 2 !== 0)
                throw Error("Input not a muliple of 2");
            var det = cMod(key[0] * key[3] - key[1] * key[2], 26);
            var inverseDet = hillCiphersInverses[det];
            if (isNaN(inverseDet))
                return "";
            for (var i = 0; i < input.length; i += 2) {
                var biGram = input.slice(i, i + 2);
                var numBiGram = [toLetterCode(biGram[0]), toLetterCode(biGram[1])];
                retValue += fromLetterCode(cMod((key[3] * numBiGram[0] - key[1] * numBiGram[1]) * inverseDet, 26));
                retValue += fromLetterCode(cMod((- key[2] * numBiGram[0] + key[0] * numBiGram[1]) * inverseDet, 26));
            }
            return retValue;
        }
    });
    export var cTrans = new Cipher<number[]>({
        name: "Columnar Transposition",
        keyInfo: new keyRanges.arrangementOfNumbers(),
        encrypt: (input: string, key: number[]) => {
            if (input.length % key.length != 0) {
                var inputLen = input.length;
                for (var i = 0; i < key.length - (inputLen % key.length); i++) {
                    input += "x";
                }
            }
            var coloums = <Array<string>>[];
            key.forEach((el) => {
                coloums[el] = "";
                for (var o = el; o < input.length; o += key.length) {
                    coloums[el] += input[o];
                }
            });
            return coloums.join("");
        },
        decrypt: (input: string, key: number[]) => {
            if (input.length % key.length != 0) {
                var inputLen = input.length;
                for (var i = 0; i < key.length - (inputLen % key.length); i++) {
                    input += "x";
                }
            }
            var newGridLength = input.length / key.length;
            var newStr = "";
            key.forEach((el) => {
                newStr += input.substr(el * newGridLength, newGridLength);
            });
            var coloums = <Array<string>>[];
            for (var i = 0; i < newGridLength; i++) {
                coloums[i] = "";
                for (var o = i; o < newStr.length; o += newGridLength) {
                    coloums[i] += newStr[o];
                }
            };
            return coloums.join("");
        }
    })
    export function reArrangefrom<type>(arrToReArrange: type[], order: number[]) {
        var retValue = <[type, number][]>arrToReArrange.map((el, i) => [el, order[i]]);
        retValue.sort((a, b) => a[1] - b[1]);
        return retValue.map((el) => el[0]);
    }
    export function reArrangeto<type>(arrToReArrange: type[], order: number[]) {
        var retValue = new Array(order.length);
        order.forEach((el, i) => retValue[i] = arrToReArrange[el - 1]);
        return retValue;
    }
    export function longFindColLength(what: string, key: number[]) {
        var retValue = uniformArray(0, key.length);
        var o = 0;
        for (var i = 0; i < what.length; o++) {
            if (o % 2 == 1) {
                i++;
                retValue[o % key.length]++;
            }
            else {
                i += 2;
                retValue[o % key.length] += 2;
            }
        }
        return reArrangefrom(retValue, key);
    }
    function seperateNgrams(what: string, n: number) {
        var retValue = <string[]>[];
        for (var i = 0; i < what.length; i++) {
            retValue.push(what.slice(i, i + n));
            i += n;
        }
        return retValue;
    }
    export function arrayOutOdd(input: string, startsWith2: boolean) {
        var retValue = <string[]>[];
        for (var i = 0, o = 0; i < input.length; o++) {
            if ((o % 2 == 0) == startsWith2) {
                retValue.push(input.slice(i, i + 2));
                i += 2;
            }
            else {
                retValue.push(input.slice(i, i + 1));
                i += 1;
            }
        }
        return retValue;
    }
    export function arrayOutEven(input: string, startsWith2: boolean) {
        if (startsWith2)
            return seperateNgrams(input, 1);
        else
            return seperateNgrams(input, 1);
    }/*
    export function intersect<type>(input: type[][]) {
        var reflect = <type[][]>[][];
        for (var i = 0; i < input.length; i++) {
            for (var o = 0; o < input[i].length; o++) {
                reflect[o].push(input[o][i]);
            }
        }
        return reflect.;
    }*/
    export var amsco = new Cipher({
        name: "amsco",
        decrypt: (input: string, key: number[]) => {
            var retValue = [];
            var rowLengths = longFindColLength(input, key);
            var init2StartDis = <boolean[]>[];
            for (var i = 0; i < key.length; i++) {
                if (i % 2 == 0)
                    init2StartDis.push(true)
                else
                    init2StartDis.push(false)
            }
            init2StartDis = reArrangefrom(init2StartDis, key);
            var func;
            if (key.length % 2 == 0) {
                func = arrayOutEven;
            }
            else {
                func = arrayOutOdd;
            }
            var sum = 0, sum1 = 0, rowCombs = [];
            rowLengths.forEach((el, i) => {
                sum1 += el;
                rowCombs.push(func(input.slice(sum, sum1), init2StartDis[i]))
                sum += el;
            });
            var reArranged = reArrangeto(rowCombs, key);
            return _.flatten(_.zip.apply(_, reArranged)).join("");
        },
        encrypt: (input: string, key: string) => forEachLetter(input, (letter, n) => cMod(letter + toLetterCode(key[(n % key.length)]), 26)),
        keyInfo: new keyRanges.arrangementOfNumbers()
    });
    export var simpleSubstitution = new Cipher<string>({
        name: "Simple Substitution",
        keyInfo: new keyRanges.arrangementOfLetters(allupperletters),
        encrypt: (input: string, key: string) => forEachLetterToSt(input, (el) => key[el]),
        decrypt: (input: string, key: string) => forEachLetterFromSt(input, (el) => key.search(el))
    })
    export var cadenus = new Cipher<number[]>({
        name: "Cadence",
        keyInfo: new keyRanges.repeatedNumbers({
            from: 0,
            to: keyLengthsTest,
        }),
        encrypt: (input: string, key: number[]) => "",
        decrypt: (input: string, key: number[]) => {
            var groups = []
            var keyLength = key.length;
            var inputLength = input.length;
            for (var qw = 0; qw < keyLength; qw++) {
                groups.push("")
            }
            for (var i = 0; i < inputLength; i++) {
                groups[i % keyLength] += input[i]
            }
            var groupsLength = groups.length;
            var retValue = new Array(groupsLength);
            for (var i = 0; i < groupsLength; i++) {
                var groupsi = groups[i], keyi = key[i]; 
                retValue[i] = groupsi.slice(keyi) + groupsi.slice(0, keyi);
            }
            retValue = ciphers.reArrangeto(retValue, permutations);
            var unZipped = Array(inputLength);
            for (var i = 0; i < inputLength; i++) {
                unZipped[i] = retValue[i % keyLength][~~(i / keyLength)]; // ~~ == Math.floor
            }
            return unZipped.join("");
        }
    })
    export var railFence = new Cipher<number>({
        name: "Rail Fence",
        keyInfo: keyRanges.numbers(2, 50),
        encrypt: (input: string, key: number) => {
            var load = false; // Whether the thing is going down or up
            var level = 0; //Where you are horizontally
            var steps = []; //The collection of steps
            for (var i = 0; i < input.length; i++) {
                if (steps[level] == undefined) {
                    steps[level] = [];
                }
                steps[level].push(input[i]);
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
        },
        decrypt: (input: string, key: number) => {
            var position;
            var plainText = [];
            //Beginning
            var i = 0;
            for (var row = 0; row < key; row++) {
                position = row;
                while (position < input.length) {
                    plainText[position] = input[i];
                    if (row == 0 || row == key - 1 || position + (key - row - 1) * 2 >= input.length)
                        i++;
                    else {
                        plainText[position + (key - row - 1) * 2] = input[i + 1];
                        i += 2;
                    }
                    position += key * 2 - 2;
                }
            }
            return plainText.join("");
        }
    })
    export var playfair = new Cipher({
        name: "Playfair",
        keyInfo: new keyRanges.arrangementOfLetters("ABCDEFGHIKLMNOPQRSTUVWXYZ"),
        encrypt: (input: string, key: string) => {
            console.error("Not Implemented"); return ""
        },
        decrypt: (input: string, key: string) => {
            var size = 5;
            function getsquareletter(x, y) {
                var retvalue = key[(y - 1) + ((x - 1) * size)];
                if (retvalue == "_") {
                    // Blank charater
                    invaidlettergot = true;
                    retvalue = "a";
                }
                return retvalue;
            }
            function getsquarepos(letter) {
                var pos = key.indexOf(letter);
                if (pos == -1) {
                    invaidlettergot = true;
                    pos = 0;
                }
                return [Math.floor((pos / size) + 1), (pos % size) + 1];
            }
            //square = removespaces(square.toUpperCase());
            if (size == undefined)
                size = 5;
            var invaidlettergot = false;
            if (input.length % 2 != 0) {
                console.log("SolvePlayfair: code passed to function has an odd length");
                return "";
            }
            var finalst = "";
            for (var i = 0; i < input.length; i += 2) {
                var a = input[i];
                var b = input[i + 1];
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
    });
    export var vigenere = new Cipher({
        name: "Vigenère",
        decrypt: (input: string, key: string) => forEachLetter(input, (letter, n) => cMod(letter - toLetterCode(key[(n % key.length)]), 26)),
        encrypt: (input: string, key: string) => forEachLetter(input, (letter, n) => cMod(letter + toLetterCode(key[(n % key.length)]), 26)),
        keyInfo: new keyRanges.repeatedLetters(allupperletters)
    });
}

function ciphersTest() {
    //solvers.hillClimbing.func(code, ciphers.simpleSubstitution, testers.chiSquared, solvers.ConsoleReporter, { useLowestValue: false });
}

module quickSolve {
    var solveTime = 0.5; //0.5 secs
    var testPeriod = 5;
    var decryptSt = allupperletters;
    export function reset() {
        var cipherTime = [];
        ciphers.allCiphers.forEach((el) => {
            var testKey = el.keyInfo.startGen();
            var dateOb = new Date();
            var startTime = (new Date()).getTime();
            for (var i = 0; i < testPeriod; i++) {
                el.decrypt(decryptSt, testKey);
            }
            var endTime = (new Date()).getTime();
            cipherTime.push(endTime - startTime);
        });
        return cipherTime;
    }
    export function init(ob: Object) {
    }
    export function start(text: string) {
    }
}


function spaceTextEx(what: string) {

}

loadingfunc.push(() => {
    ciphers.pageLoad();/*
    if (localStorage.getItem("quickSolve") == null)
        quickSolve.reset();
    else
        quickSolve.init(JSON.parse(localStorage.getItem("quickSolve")));*/
});