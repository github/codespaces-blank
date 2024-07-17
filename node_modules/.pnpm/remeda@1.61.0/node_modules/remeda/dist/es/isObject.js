export function isObject(data) {
    return Boolean(data) && !Array.isArray(data) && typeof data === "object";
}
