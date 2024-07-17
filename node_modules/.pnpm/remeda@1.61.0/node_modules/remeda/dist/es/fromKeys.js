import { purry } from "./purry";
export function fromKeys() {
    return purry(fromKeysImplementation, arguments);
}
function fromKeysImplementation(data, mapper) {
    var result = {};
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var key = data_1[_i];
        result[key] = mapper(key);
    }
    return result;
}
