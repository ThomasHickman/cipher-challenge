/// <reference path="def.d.ts" />
/// <reference path="CiphersTS.ts" />

function setDefault<type>(defaultOb: Object, ob: type) {
    if (ob == undefined) {
        ob = <type>{};
    }
    for (var i in defaultOb) {/*
        if (typeof (defaultOb[i]) == "object" && !Array.isArray(defaultOb[i])) {
            ob[i] = setDefault(defaultOb[i], ob[i]);
        } 
        else {*/
            if (ob[i] == undefined) {
                ob[i] = defaultOb[i];
            };
        //}
    }
    return ob;
}

module stats {
    interface DataType {
        toHTML(): HTMLSpanElement;
        toString(): string;
        setOptions?: (ob: Object) => void;
    }

    class BuiltInType<type> implements DataType {
        private value: type;
        constructor(value: type) {
            this.value = value;
        }
        toHTML() {
            var retValue = document.createElement("span");
            retValue.innerText = this.value.toString();
            return retValue;
        }
        toString() {
            return this.value.toString();
        }
    }

    interface Tuple<a, b> extends Array<any> {
        0: a;
        1: b;
    }

    interface listType <type> {
        value: type;
        frequency: number
    }

    interface listOptions {
        delayProcessing: boolean;
        alreadySorted: boolean;
        itemsToShow: number;
    }

    class List<type> implements DataType {
        private value: listType<type>[];
        private options: listOptions;
        delayedWork() {
            if (!this.options.alreadySorted) {
                this.value.sort((a, b) => b.frequency - a.frequency);
            }
        }
        findStandardDeviation() {
            var sigmaXSquared = 0;
            var sigmaX = 0;
            var n = this.value.length;
            this.value.forEach((el) => {
                sigmaXSquared += el.frequency * el.frequency;
                sigmaX += el.frequency;
            });
            return Math.sqrt(sigmaXSquared - (sigmaX * sigmaX)/n);
        }
        constructor(value: listType<type>[], options?: listOptions) {
            options = setDefault({
                delayProcessing: false,
                alreadySorted: false,
                itemsToShow: 5
            }, options);
            this.value = value;
            this.options = options;

            if (options.delayProcessing == false) {
                this.delayedWork();
            }
        }
        toHTML() {
            var retValue = document.createElement("div");
            throw new Error("Not implemented!");
            return retValue;
        }
        toString() {
            var allValues = [];
            var biggestLength = 2;
            var value = "";
            for (var i = 0; i < this.options.itemsToShow; i++) {
                value = this.value[i].value.toString();
                if (value.length > biggestLength)
                    biggestLength = value.length;
                allValues.push(this.value[i].value + "x" + this.value[i].frequency);
            }/*
            retValue += "Top items:\n"
            var tabs = "";
            for (var i = 0; i < biggestLength; i++) {
                tabs += "\t";
            }*/
            return allValues.join(", ") + " σ = " + this.findStandardDeviation();
        }
    }
    interface reCallable {
        func: Function;
        preFunc: Function;
        postFunc: Function;
    }

    class Stat<type extends DataType> {
        static allStats = <Stat<DataType>[]>[];
        name: string;
        func: (str: string) => type;
        _pure = <{
            func: (str: string) => type;
            preFunc: (str: string) => string;
        }>{};
        constructor(data: {
            name: string;
            func: (str: string) => type
            options?: {
                requireFormattedText: boolean;
            }
        }) {
            data.options = setDefault({
                requireFormattedText: true
            }, data.options);
            this.name = data.name;
            this._pure.func = data.func;
            if (data.options.requireFormattedText) {
                this._pure.preFunc = formattedTextToAllCaps;
            }
            else {
                this._pure.preFunc = (str) => str;
            }
            this.func = (input: string) => {
                if (input == "")
                    throw new Error("No input entered!");
                return data.func(this._pure.preFunc(input));
            }
            Stat.allStats.push(this);
        }
    }

    function countletters(letter: string, text: string) {
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

    var chiSquared = new Stat<BuiltInType<number>>({
        name: "Chi Squared",
        func: (text: string) => {
            var result = 0;
            text = text.toUpperCase();
            var length = text.match(/[A-Z]/gi).length;
            for (var i = 0; i < allupperletters.length; i++) {
                result += Math.pow(countletters(allupperletters[i], text) - (RealLetterProb[i] / 100) * length, 2) / ((RealLetterProb[i] / 100) * length);
            }
            return new BuiltInType(result);
        }
    });

    var length = new Stat<BuiltInType<number>>({
        name: "length",
        func: (text: string) => {
            return new BuiltInType(text.length);
        }
    });

    var nGrams = (num: number, prefix: string) => {
        return {
            name: prefix + "grams",
            func: (text: string) => {
                if (text.length < num)
                    throw new Error("Cannot find " + prefix + "grams with length greater than the text");
                var listArr = <listType<string>[]>[];
                var foundValue = false;
                for (var i = 0; i < text.length - num; i++) {
                    var testingValue = text.slice(i, i + num);
                    var isNotInArr = false;
                    isNotInArr = listArr.every((el) => {
                        if (el.value == testingValue) {
                            el.frequency++;
                            return false;
                        }
                        return true;
                    });
                    if (isNotInArr){
                        listArr.push({
                            frequency: 1,
                            value: testingValue
                        });
                    }
                }
                return new List<string>(listArr);
            }
        }
    };

    var monograms = new Stat<List<string>>(nGrams(1, "mono"));
    var bigrams = new Stat<List<string>>(nGrams(2, "bi"));
    var trigrams = new Stat<List<string>>(nGrams(3, "tri"));
    var quadgrams = new Stat<List<string>>(nGrams(4, "quad"));

    function findQuadram(word: string): number {
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

    function findAllNGrams(text: string, N: number) {
        if (text.length <= N)
            throw new Error("Cannot search for N Grams greater than the text length");
        var NGrams = new Map();
    }

    var quadramRate = new Stat<BuiltInType<number>>({
        name: "Quadram Rate",
        func: (text: string) => {
            var sum = 0;
            var endPoint = text.length - 3;
            for (var i = 0; i < endPoint; ++i) {
                sum += findQuadram(text.slice(i, i + 4));
            }
            return new BuiltInType(sum / 10000);
        }
    });

    export function quadramDistance(text: string, letters: string[]) {
        var prevChar = null;
        var sumDist = 0;
        var n = 0;
        var firstLetterLocs = <Array<number>>[];
        var secondLetterLocs = <Array<number>>[];
        for (var i = 0; i < text.length; i++) {
            if (text[i] == letters[0]) {
                if (secondLetterLocs.length !== 0) {
                    sumDist += i - secondLetterLocs.pop();
                    n++;
                }
                firstLetterLocs.push(i);
            }
            else if (text[i] == letters[1]) {
                if (firstLetterLocs.length !== 0) {
                    sumDist += i - firstLetterLocs.pop();
                    n++;
                }
                secondLetterLocs.push(i);
            }
        }
        return sumDist / n;
    }

    export function dispayAllStatsConsole(text: string) {
        Stat.allStats.forEach((el) => {
            console.log(el.name + ": " + el.func(text).toString());
        });
    }
    export function testAllCipherStats() {
        for (var i = 0; i < 4; i++) {
            $.get("data/words.txt").done(function (data) {
                var lines = data.split("\n");
                lines.forEach(function (el) {
                });
            });
        } 
    }
}