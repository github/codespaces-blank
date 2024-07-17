"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropWhile = void 0;
var purry_1 = require("./purry");
function dropWhile() {
    return (0, purry_1.purry)(_dropWhile, arguments);
}
exports.dropWhile = dropWhile;
function _dropWhile(data, predicate) {
    for (var i = 0; i < data.length; i++) {
        if (!predicate(data[i])) {
            return data.slice(i);
        }
    }
    return [];
}
