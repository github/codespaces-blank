import { purry } from "./purry";
export function takeWhile() {
    return purry(_takeWhile, arguments);
}
function _takeWhile(array, fn) {
    var ret = [];
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var item = array_1[_i];
        if (!fn(item)) {
            break;
        }
        ret.push(item);
    }
    return ret;
}
