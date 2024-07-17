"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToObj = void 0;
var purry_1 = require("./purry");
function mapToObj() {
    return (0, purry_1.purry)(_mapToObj(false), arguments);
}
exports.mapToObj = mapToObj;
var _mapToObj = function (indexed) {
    return function (array, fn) {
        var out = {};
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            var _a = indexed ? fn(element, index, array) : fn(element), key = _a[0], value = _a[1];
            out[key] = value;
        }
        return out;
    };
};
(function (mapToObj) {
    function indexed() {
        return (0, purry_1.purry)(_mapToObj(true), arguments);
    }
    mapToObj.indexed = indexed;
})(mapToObj || (exports.mapToObj = mapToObj = {}));
