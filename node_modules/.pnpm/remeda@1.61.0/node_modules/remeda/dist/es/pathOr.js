import { purry } from "./purry";
export function pathOr() {
    return purry(_pathOr, arguments);
}
function _pathOr(data, path, defaultValue) {
    var current = data;
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var prop = path_1[_i];
        if (current === null || current === undefined) {
            break;
        }
        current = current[prop];
    }
    return current !== null && current !== void 0 ? current : defaultValue;
}
