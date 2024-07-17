"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexBy = void 0;
var purry_1 = require("./purry");
function indexBy() {
    return (0, purry_1.purry)(_indexBy(false), arguments);
}
exports.indexBy = indexBy;
var _indexBy = function (indexed) {
    return function (array, fn) {
        var out = {};
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var value = indexed ? fn(item, index, array) : fn(item);
            var key = String(value);
            out[key] = item;
        }
        return out;
    };
};
function indexByStrict() {
    return (0, purry_1.purry)(_indexByStrict, arguments);
}
function _indexByStrict(array, fn) {
    var out = {};
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var item = array_1[_i];
        var key = fn(item);
        out[key] = item;
    }
    return out;
}
(function (indexBy) {
    function indexed() {
        return (0, purry_1.purry)(_indexBy(true), arguments);
    }
    indexBy.indexed = indexed;
    indexBy.strict = indexByStrict;
})(indexBy || (exports.indexBy = indexBy = {}));
