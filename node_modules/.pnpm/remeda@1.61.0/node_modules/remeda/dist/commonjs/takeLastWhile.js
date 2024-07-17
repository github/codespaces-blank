"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeLastWhile = void 0;
var purry_1 = require("./purry");
function takeLastWhile() {
    return (0, purry_1.purry)(_takeLastWhile, arguments);
}
exports.takeLastWhile = takeLastWhile;
function _takeLastWhile(data, predicate) {
    for (var i = data.length - 1; i >= 0; i--) {
        if (!predicate(data[i])) {
            return data.slice(i + 1);
        }
    }
    return data.slice();
}
