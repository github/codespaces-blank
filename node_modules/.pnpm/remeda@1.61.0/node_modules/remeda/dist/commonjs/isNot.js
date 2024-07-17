"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNot = void 0;
function isNot(predicate) {
    return function (data) { return !predicate(data); };
}
exports.isNot = isNot;
