"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyIdentityEvaluator = exports.lazyEmptyEvaluator = void 0;
var EMPTY_PIPE = { done: true, hasNext: false };
var lazyEmptyEvaluator = function () { return EMPTY_PIPE; };
exports.lazyEmptyEvaluator = lazyEmptyEvaluator;
var lazyIdentityEvaluator = function (value) {
    return ({
        hasNext: true,
        next: value,
        done: false,
    });
};
exports.lazyIdentityEvaluator = lazyIdentityEvaluator;
