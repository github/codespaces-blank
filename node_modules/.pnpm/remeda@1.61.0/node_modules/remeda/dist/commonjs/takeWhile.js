"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeWhile = void 0;
var purry_1 = require("./purry");
function takeWhile() {
    return (0, purry_1.purry)(_takeWhile, arguments);
}
exports.takeWhile = takeWhile;
function _takeWhile(array, fn) {
    var ret = [];
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var item = array_1[_i];
        if (!fn(item)) {
            break;
        }
        ret.push(item);
    }
    return ret;
}
