"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
var purry_1 = require("./purry");
function pick() {
    return (0, purry_1.purry)(_pick, arguments);
}
exports.pick = pick;
function _pick(object, names) {
    var out = {};
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        if (name_1 in object) {
            out[name_1] = object[name_1];
        }
    }
    return out;
}
