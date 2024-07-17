"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = void 0;
function isNumber(data) {
    return typeof data === "number" && !isNaN(data);
}
exports.isNumber = isNumber;
