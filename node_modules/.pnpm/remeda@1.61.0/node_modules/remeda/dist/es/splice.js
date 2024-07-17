var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { purry } from "./purry";
export function splice() {
    return purry(_splice, arguments);
}
function _splice(items, start, deleteCount, replacement) {
    var result = items.slice();
    result.splice.apply(result, __spreadArray([start, deleteCount], replacement, false));
    return result;
}
