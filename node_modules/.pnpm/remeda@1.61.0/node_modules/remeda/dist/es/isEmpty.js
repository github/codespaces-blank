import { isArray } from "./isArray";
import { isObject } from "./isObject";
import { isString } from "./isString";
export function isEmpty(data) {
    if (data === undefined) {
        return true;
    }
    if (isArray(data) || isString(data)) {
        return data.length === 0;
    }
    if (isObject(data)) {
        return Object.keys(data).length === 0;
    }
    return false;
}
