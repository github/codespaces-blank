"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = void 0;
var isArray_1 = require("./isArray");
var isObject_1 = require("./isObject");
var isString_1 = require("./isString");
function isEmpty(data) {
    if (data === undefined) {
        return true;
    }
    if ((0, isArray_1.isArray)(data) || (0, isString_1.isString)(data)) {
        return data.length === 0;
    }
    if ((0, isObject_1.isObject)(data)) {
        return Object.keys(data).length === 0;
    }
    return false;
}
exports.isEmpty = isEmpty;
