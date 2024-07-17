"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyDataLastImpl = void 0;
function lazyDataLastImpl(fn, args, lazyFactory) {
    var ret = function (data) {
        return fn.apply(void 0, __spreadArray([data], Array.from(args), false));
    };
    var lazy = lazyFactory !== null && lazyFactory !== void 0 ? lazyFactory : fn.lazy;
    return lazy === undefined
        ? ret
        : Object.assign(ret, { lazy: lazy, lazyArgs: args });
}
exports.lazyDataLastImpl = lazyDataLastImpl;
