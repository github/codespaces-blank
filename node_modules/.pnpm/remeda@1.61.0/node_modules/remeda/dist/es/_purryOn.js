var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
export function purryOn(isArg, implementation, args) {
    var callArgs = Array.from(args);
    return isArg(args[0])
        ?
            function (data) { return implementation.apply(void 0, __spreadArray([data], callArgs, false)); }
        : implementation.apply(void 0, callArgs);
}
