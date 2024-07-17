"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullObject = void 0;
var purry_1 = require("./purry");
function pullObject() {
    return (0, purry_1.purry)(pullObjectImplementation, arguments);
}
exports.pullObject = pullObject;
function pullObjectImplementation(data, keyExtractor, valueExtractor) {
    var result = {};
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        var key = keyExtractor(item);
        var value = valueExtractor(item);
        result[key] = value;
    }
    return result;
}
