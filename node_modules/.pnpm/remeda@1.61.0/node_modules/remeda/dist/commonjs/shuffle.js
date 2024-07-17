"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = void 0;
var purry_1 = require("./purry");
function shuffle() {
    return (0, purry_1.purry)(_shuffle, arguments);
}
exports.shuffle = shuffle;
function _shuffle(items) {
    var result = items.slice();
    for (var index = 0; index < items.length; index++) {
        var rand = index + Math.floor(Math.random() * (items.length - index));
        var value = result[rand];
        result[rand] = result[index];
        result[index] = value;
    }
    return result;
}
