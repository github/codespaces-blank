import { purryOn } from "./_purryOn";
export function conditional() {
    return purryOn(isCase, conditionalImplementation, arguments);
}
function conditionalImplementation(data) {
    var cases = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        cases[_i - 1] = arguments[_i];
    }
    for (var _a = 0, cases_1 = cases; _a < cases_1.length; _a++) {
        var _b = cases_1[_a], when = _b[0], then = _b[1];
        if (when(data)) {
            return then(data);
        }
    }
    throw new Error("conditional: data failed for all cases");
}
function isCase(maybeCase) {
    if (!Array.isArray(maybeCase)) {
        return false;
    }
    var _a = maybeCase, when = _a[0], then = _a[1], rest = _a.slice(2);
    return (typeof when === "function" &&
        when.length <= 1 &&
        typeof then === "function" &&
        then.length <= 1 &&
        rest.length === 0);
}
(function (conditional) {
    function defaultCase(then) {
        if (then === void 0) { then = trivialDefaultCase; }
        return [acceptAnything, then];
    }
    conditional.defaultCase = defaultCase;
})(conditional || (conditional = {}));
var acceptAnything = function () { return true; };
var trivialDefaultCase = function () { return undefined; };
