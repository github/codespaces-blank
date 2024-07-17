export var prop = function (propName) {
    return function (_a) {
        var _b = propName, value = _a[_b];
        return value;
    };
};
