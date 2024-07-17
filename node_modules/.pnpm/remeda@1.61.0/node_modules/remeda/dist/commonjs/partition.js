"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partition = void 0;
var purry_1 = require("./purry");
function partition() {
    return (0, purry_1.purry)(_partition(false), arguments);
}
exports.partition = partition;
var _partition = function (indexed) {
    return function (array, fn) {
        var ret = [[], []];
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var matches = indexed ? fn(item, index, array) : fn(item);
            ret[matches ? 0 : 1].push(item);
        }
        return ret;
    };
};
(function (partition) {
    function indexed() {
        return (0, purry_1.purry)(_partition(true), arguments);
    }
    partition.indexed = indexed;
})(partition || (exports.partition = partition = {}));
