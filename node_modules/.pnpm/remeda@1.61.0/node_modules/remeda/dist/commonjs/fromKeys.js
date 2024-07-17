"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromKeys = void 0;
var purry_1 = require("./purry");
function fromKeys() {
    return (0, purry_1.purry)(fromKeysImplementation, arguments);
}
exports.fromKeys = fromKeys;
function fromKeysImplementation(data, mapper) {
    var result = {};
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var key = data_1[_i];
        result[key] = mapper(key);
    }
    return result;
}
