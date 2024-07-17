var EMPTY_PIPE = { done: true, hasNext: false };
export var lazyEmptyEvaluator = function () { return EMPTY_PIPE; };
export var lazyIdentityEvaluator = function (value) {
    return ({
        hasNext: true,
        next: value,
        done: false,
    });
};
