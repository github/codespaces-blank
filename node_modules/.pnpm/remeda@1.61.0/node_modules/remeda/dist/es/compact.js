import { isTruthy } from "./isTruthy";
export function compact(items) {
    return items.filter(isTruthy);
}
