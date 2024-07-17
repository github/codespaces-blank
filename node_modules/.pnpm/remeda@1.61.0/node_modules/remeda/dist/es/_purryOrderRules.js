var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var COMPARATORS = {
    asc: function (x, y) { return x > y; },
    desc: function (x, y) { return x < y; },
};
export function purryOrderRules(func, inputArgs) {
    var _a = (Array.isArray(inputArgs) ? inputArgs : Array.from(inputArgs)), dataOrRule = _a[0], rules = _a.slice(1);
    if (!isOrderRule(dataOrRule)) {
        var compareFn_1 = orderRuleComparer.apply(void 0, rules);
        return func(dataOrRule, compareFn_1);
    }
    var compareFn = orderRuleComparer.apply(void 0, __spreadArray([dataOrRule], rules, false));
    return function (data) { return func(data, compareFn); };
}
export function purryOrderRulesWithArgument(func, inputArgs) {
    var _a = Array.from(inputArgs), first = _a[0], second = _a[1], rest = _a.slice(2);
    var arg;
    var argRemoved;
    if (isOrderRule(second)) {
        arg = first;
        argRemoved = __spreadArray([second], rest, true);
    }
    else {
        arg = second;
        argRemoved = __spreadArray([first], rest, true);
    }
    return purryOrderRules(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return func.apply(void 0, __spreadArray(__spreadArray([], args, false), [arg], false));
    }, argRemoved);
}
function orderRuleComparer(primaryRule, secondaryRule) {
    var otherRules = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        otherRules[_i - 2] = arguments[_i];
    }
    var projector = typeof primaryRule === "function" ? primaryRule : primaryRule[0];
    var direction = typeof primaryRule === "function" ? "asc" : primaryRule[1];
    var _a = COMPARATORS, _b = direction, comparator = _a[_b];
    var nextComparer = secondaryRule === undefined
        ? undefined
        : orderRuleComparer.apply(void 0, __spreadArray([secondaryRule], otherRules, false));
    return function (a, b) {
        var _a;
        var projectedA = projector(a);
        var projectedB = projector(b);
        if (comparator(projectedA, projectedB)) {
            return 1;
        }
        if (comparator(projectedB, projectedA)) {
            return -1;
        }
        return (_a = nextComparer === null || nextComparer === void 0 ? void 0 : nextComparer(a, b)) !== null && _a !== void 0 ? _a : 0;
    };
}
function isOrderRule(x) {
    if (isProjection(x)) {
        return true;
    }
    if (typeof x !== "object" || !Array.isArray(x)) {
        return false;
    }
    var _a = x, maybeProjection = _a[0], maybeDirection = _a[1], rest = _a.slice(2);
    return (isProjection(maybeProjection) &&
        typeof maybeDirection === "string" &&
        maybeDirection in COMPARATORS &&
        rest.length === 0);
}
var isProjection = function (x) {
    return typeof x === "function" && x.length === 1;
};
