export function isPlainObject(data) {
    if (typeof data !== "object" || data === null) {
        return false;
    }
    var proto = Object.getPrototypeOf(data);
    return proto === null || proto === Object.prototype;
}
