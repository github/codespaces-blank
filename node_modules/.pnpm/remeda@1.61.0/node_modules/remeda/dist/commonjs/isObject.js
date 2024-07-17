"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = void 0;
function isObject(data) {
    return Boolean(data) && !Array.isArray(data) && typeof data === "object";
}
exports.isObject = isObject;
