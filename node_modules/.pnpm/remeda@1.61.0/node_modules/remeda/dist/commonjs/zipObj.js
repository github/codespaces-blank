"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipObj = void 0;
var purry_1 = require("./purry");
function zipObj() {
    return (0, purry_1.purry)(_zipObj, arguments);
}
exports.zipObj = zipObj;
function _zipObj(first, second) {
    var resultLength = first.length > second.length ? second.length : first.length;
    var result = {};
    for (var i = 0; i < resultLength; i++) {
        result[first[i]] = second[i];
    }
    return result;
}
