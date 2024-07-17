"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compact = void 0;
var isTruthy_1 = require("./isTruthy");
function compact(items) {
    return items.filter(isTruthy_1.isTruthy);
}
exports.compact = compact;
