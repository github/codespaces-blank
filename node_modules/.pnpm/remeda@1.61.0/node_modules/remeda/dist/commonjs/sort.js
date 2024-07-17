"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = void 0;
var purry_1 = require("./purry");
function sort() {
    return (0, purry_1.purry)(_sort, arguments);
}
exports.sort = sort;
function _sort(items, cmp) {
    var ret = items.slice();
    ret.sort(cmp);
    return ret;
}
(function (sort) {
    sort.strict = sort;
})(sort || (exports.sort = sort = {}));
