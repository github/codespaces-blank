"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropLastWhile = void 0;
var purry_1 = require("./purry");
function dropLastWhile() {
    return (0, purry_1.purry)(_dropLastWhile, arguments);
}
exports.dropLastWhile = dropLastWhile;
function _dropLastWhile(data, predicate) {
    for (var i = data.length - 1; i >= 0; i--) {
        if (!predicate(data[i])) {
            return data.slice(0, i + 1);
        }
    }
    return [];
}
