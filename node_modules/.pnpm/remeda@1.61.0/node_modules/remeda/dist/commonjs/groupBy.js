"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = void 0;
var purry_1 = require("./purry");
function groupBy() {
    return (0, purry_1.purry)(_groupBy(false), arguments);
}
exports.groupBy = groupBy;
var _groupBy = function (indexed) {
    return function (array, fn) {
        var ret = {};
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var key = indexed ? fn(item, index, array) : fn(item);
            if (key !== undefined) {
                var actualKey = String(key);
                var items = ret[actualKey];
                if (items === undefined) {
                    items = [];
                    ret[actualKey] = items;
                }
                items.push(item);
            }
        }
        return ret;
    };
};
(function (groupBy) {
    function indexed() {
        return (0, purry_1.purry)(_groupBy(true), arguments);
    }
    groupBy.indexed = indexed;
    groupBy.strict = groupBy;
})(groupBy || (exports.groupBy = groupBy = {}));
