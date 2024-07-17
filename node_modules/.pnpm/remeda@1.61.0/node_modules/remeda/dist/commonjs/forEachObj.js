"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEachObj = void 0;
var purry_1 = require("./purry");
function forEachObj() {
    return (0, purry_1.purry)(_forEachObj(false), arguments);
}
exports.forEachObj = forEachObj;
var _forEachObj = function (indexed) {
    return function (data, fn) {
        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var _a = data, _b = key, val = _a[_b];
                if (indexed) {
                    fn(val, key, data);
                }
                else {
                    fn(val);
                }
            }
        }
        return data;
    };
};
(function (forEachObj) {
    function indexed() {
        return (0, purry_1.purry)(_forEachObj(true), arguments);
    }
    forEachObj.indexed = indexed;
})(forEachObj || (exports.forEachObj = forEachObj = {}));
