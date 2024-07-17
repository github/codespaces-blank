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
export function addProp() {
    return purry(_addProp, arguments);
}
function _addProp(obj, prop, value) {
    var _a;
    return __assign(__assign({}, obj), (_a = {}, _a[prop] = value, _a));
}
