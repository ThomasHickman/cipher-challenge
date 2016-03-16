declare var _UpdateLocal: {
    updateFunc: () => void
};
declare var loadingfunc: Array<() => void>;


module Core {
    var unloadFuncs = <Array<() => void>>[];
    export function addLoadFunc(func: () => void) {
        loadingfunc.push(func);
    }
    onunload = () => unloadFuncs.forEach((el) => el());
    export function addUnloadFunction(func: () => void) {
        unloadFuncs.push(func);
    }
    export function localStorageItem(any) {
    }
    export class LastingValues {
        constructor(name: string, initValue: any) {
            throw Error();
        }
        get value() {
            return "w";
        }
        set value(v: string) {
        }
    }
    export function load() {
    }
}

Core.addLoadFunc(() => {
    if (localStorage.getItem("code") !== null/*Use == to get anything which looks like an empty property*/) {
        if (document.getElementById("nospacedcode") != null) {
            document.getElementById("nospacedcode").innerText = localStorage.getItem("code");
        }
        code = localStorage.getItem("code");
    }
});

Core.addUnloadFunction(() => {
    localStorage.setItem("code", code);
});

module UI {
    module defaultMode {
        export var currentTranslationType;
    }
}

class Mode {
    static currMode = "none";
    static idNum = 0;
    HTML = document.createElement("div");
    onModeLoad: () => void;
    onModeUpdate: () => void;
    idSt: string;
    constructor(htmlLoc: string, name: string, onloadfunc: () => void, updatefunc: () => void, idSt: string) {
        var __this = this;
        Mode.idNum++;
        Core.addLoadFunc(() => {
            var X = new XMLHttpRequest();
            X.open("GET", htmlLoc, true);
            X.send();
            X.onreadystatechange = function () {
                if (X.readyState == 4) {
                    if (X.status == 200) {
                        __this.HTML.innerHTML = X.responseText;
                        var menuItem = document.createElement("div");
                        menuItem.className = "ModeItem";
                        menuItem.onclick = () => { __this.changeTo() };
                        menuItem.innerHTML = name;
                        document.getElementById("ModeCont").appendChild(menuItem);
                        __this.onModeLoad = onloadfunc;
                        __this.onModeUpdate = updatefunc;
                        if (idSt == "EnterCode") {
                            __this.changeTo();
                        }
                        return;
                    }
                    console.error("The webpage " + htmlLoc + " cannot be found, the error code is " + X.status);
                    return -1;
                }
            };
        })
    }
    changeTo() {
        document.getElementById("moded").removeChild(document.getElementById("moded").childNodes[0]);
        document.getElementById("moded").appendChild(this.HTML);
        Mode.currMode = this.idSt;
        this.onModeLoad();
        _UpdateLocal.updateFunc = this.onModeLoad;
    }
}

var advancedMode = new Mode("Modes/HTML/Crib.html", "Thingy", function () { }, function () { }, "CRIB");