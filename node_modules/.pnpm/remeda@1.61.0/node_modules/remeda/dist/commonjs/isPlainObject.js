"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = void 0;
function isPlainObject(data) {
    if (typeof data !== "object" || data === null) {
        return false;
    }
    var proto = Object.getPrototypeOf(data);
    return proto === null || proto === Object.prototype;
}
exports.isPlainObject = isPlainObject;
