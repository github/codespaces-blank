"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSubObject = void 0;
var isDeepEqual_1 = require("./isDeepEqual");
var purry_1 = require("./purry");
function hasSubObject() {
    return (0, purry_1.purry)(_hasSubObject, arguments);
}
exports.hasSubObject = hasSubObject;
function _hasSubObject(data, subObject) {
    for (var _i = 0, _a = Object.keys(subObject); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
            return false;
        }
        if (!(0, isDeepEqual_1.isDeepEqual)(subObject[key], data[key])) {
            return false;
        }
    }
    return true;
}
