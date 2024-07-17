"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = void 0;
function type(val) {
    return val === null
        ? "Null"
        : val === undefined
            ? "Undefined"
            : Object.prototype.toString.call(val).slice(8, -1);
}
exports.type = type;
