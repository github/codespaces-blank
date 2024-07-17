"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatMapToObj = void 0;
var purry_1 = require("./purry");
function flatMapToObj() {
    return (0, purry_1.purry)(_flatMapToObj(false), arguments);
}
exports.flatMapToObj = flatMapToObj;
var _flatMapToObj = function (indexed) {
    return function (array, fn) {
        var out = {};
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            var items = indexed ? fn(element, index, array) : fn(element);
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var _a = items_1[_i], key = _a[0], value = _a[1];
                out[key] = value;
            }
        }
        return out;
    };
};
(function (flatMapToObj) {
    function indexed() {
        return (0, purry_1.purry)(_flatMapToObj(true), arguments);
    }
    flatMapToObj.indexed = indexed;
})(flatMapToObj || (exports.flatMapToObj = flatMapToObj = {}));
