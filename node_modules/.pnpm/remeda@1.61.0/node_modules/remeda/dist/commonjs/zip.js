"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zip = void 0;
var purry_1 = require("./purry");
function zip() {
    return (0, purry_1.purry)(_zip, arguments);
}
exports.zip = zip;
function _zip(first, second) {
    var resultLength = first.length > second.length ? second.length : first.length;
    var result = [];
    for (var i = 0; i < resultLength; i++) {
        result.push([first[i], second[i]]);
    }
    return result;
}
(function (zip) {
    zip.strict = zip;
})(zip || (exports.zip = zip = {}));
