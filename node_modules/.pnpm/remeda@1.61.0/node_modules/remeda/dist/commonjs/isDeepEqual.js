"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeepEqual = void 0;
var purry_1 = require("./purry");
function isDeepEqual() {
    return (0, purry_1.purry)(isDeepEqualImplementation, arguments);
}
exports.isDeepEqual = isDeepEqual;
function isDeepEqualImplementation(data, other) {
    if (data === other) {
        return true;
    }
    if (typeof data === "number" && typeof other === "number") {
        return data !== data && other !== other;
    }
    if (typeof data !== "object" || typeof other !== "object") {
        return false;
    }
    if (data === null || other === null) {
        return false;
    }
    if (Object.getPrototypeOf(data) !== Object.getPrototypeOf(other)) {
        return false;
    }
    if (data instanceof Set) {
        return isDeepEqualSets(data, other);
    }
    if (Array.isArray(data)) {
        if (data.length !== other.length) {
            return false;
        }
        for (var i = 0; i < data.length; i++) {
            if (!isDeepEqualImplementation(data[i], other[i])) {
                return false;
            }
        }
        return true;
    }
    if (data instanceof Date) {
        return data.getTime() === other.getTime();
    }
    if (data instanceof RegExp) {
        return data.toString() === other.toString();
    }
    if (data instanceof Map) {
        return isDeepEqualMaps(data, other);
    }
    var keys = Object.keys(data);
    if (keys.length !== Object.keys(other).length) {
        return false;
    }
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (!Object.prototype.hasOwnProperty.call(other, key)) {
            return false;
        }
        if (!isDeepEqualImplementation(data[key], other[key])) {
            return false;
        }
    }
    return true;
}
function isDeepEqualMaps(data, other) {
    if (data.size !== other.size) {
        return false;
    }
    var keys = Array.from(data.keys());
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        if (!other.has(key)) {
            return false;
        }
        if (!isDeepEqualImplementation(data.get(key), other.get(key))) {
            return false;
        }
    }
    return true;
}
function isDeepEqualSets(data, other) {
    if (data.size !== other.size) {
        return false;
    }
    var dataArr = Array.from(data.values());
    var otherArr = Array.from(other.values());
    for (var _i = 0, dataArr_1 = dataArr; _i < dataArr_1.length; _i++) {
        var dataItem = dataArr_1[_i];
        var isFound = false;
        for (var i = 0; i < otherArr.length; i++) {
            if (isDeepEqualImplementation(dataItem, otherArr[i])) {
                isFound = true;
                otherArr.splice(i, 1);
                break;
            }
        }
        if (!isFound) {
            return false;
        }
    }
    return true;
}
