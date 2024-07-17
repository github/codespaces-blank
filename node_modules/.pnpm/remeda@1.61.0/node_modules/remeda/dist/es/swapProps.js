var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { purry } from "./purry";
export function swapProps() {
    return purry(_swapProps, arguments);
}
function _swapProps(obj, key1, key2) {
    var _a;
    var _b = obj, _c = key1, value1 = _b[_c], _d = key2, value2 = _b[_d];
    return __assign(__assign({}, obj), (_a = {}, _a[key1] = value2, _a[key2] = value1, _a));
}
