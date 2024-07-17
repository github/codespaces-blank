"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.first = void 0;
var purry_1 = require("./purry");
function first() {
    return (0, purry_1.purry)(_first, arguments, first.lazy);
}
exports.first = first;
function _first(_a) {
    var item = _a[0];
    return item;
}
(function (first) {
    function lazy() {
        return function (value) { return ({ done: true, hasNext: true, next: value }); };
    }
    first.lazy = lazy;
    (function (lazy) {
        lazy.single = true;
    })(lazy = first.lazy || (first.lazy = {}));
})(first || (exports.first = first = {}));
