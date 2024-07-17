import { isDeepEqual } from "./isDeepEqual";
import { purry } from "./purry";
export function hasSubObject() {
    return purry(_hasSubObject, arguments);
}
function _hasSubObject(data, subObject) {
    for (var _i = 0, _a = Object.keys(subObject); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
            return false;
        }
        if (!isDeepEqual(subObject[key], data[key])) {
            return false;
        }
    }
    return true;
}
