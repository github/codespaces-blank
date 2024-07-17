"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = void 0;
function once(fn) {
    var called = false;
    var ret;
    return function () {
        if (!called) {
            ret = fn();
            called = true;
        }
        return ret;
    };
}
exports.once = once;
